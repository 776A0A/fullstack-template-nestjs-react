import {
  Chapter,
  Lexile,
  Project,
  ProjectBuilder,
  ProjectBuilderFactory,
  ProjectRepository,
  Tag,
  TagBuilderFactory,
} from '@/domain/project';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { ChapterEntity, ProjectEntity, ProjectTagEntity } from './entity';

@Injectable()
export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly buildFactory: ProjectBuilderFactory,
    private readonly tagBuilderFactory: TagBuilderFactory,
  ) {}

  async create(userId: string, project: Project): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.save(
        ProjectEntity,
        this.buildProjectEntity(userId, project),
      );

      // 保存章节
      for (const chapter of project.chapters()) {
        await manager.save(
          ChapterEntity,
          this.buildChapterEntity(userId, chapter),
        );
      }

      // 保存标签关联
      for (const [_, tag] of project.tags()) {
        await manager.save(
          ProjectTagEntity,
          this.buildProjectTagEntity(userId, project.id(), tag.id()),
        );
      }
    });
  }

  async update(userId: string, project: Project): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      // 更新项目基本信息
      if (project.isUpdated()) {
        await manager.update(
          ProjectEntity,
          { id: project.id() },
          {
            title: project.title(),
            version: project.version(),
            lastUpdatedBy: userId,
          },
        );
      }

      // 更新章节
      for (const chapter of project.chapters()) {
        if (chapter.isCreated()) {
          await manager.save(
            ChapterEntity,
            this.buildChapterEntity(userId, chapter),
          );
        } else if (chapter.isUpdated()) {
          await manager.update(
            ChapterEntity,
            { id: chapter.id() },
            {
              title: chapter.title(),
              order: chapter.order(),
              lastUpdatedBy: userId,
            },
          );
        } else if (chapter.isDeleted()) {
          await manager.update(
            ChapterEntity,
            { id: chapter.id() },
            { deleted: 1, lastUpdatedBy: userId },
          );
        }
      }

      // 更新标签关联
      for (const [_, tag] of project.tags()) {
        if (tag.isCreated()) {
          await manager.save(
            ProjectTagEntity,
            this.buildProjectTagEntity(userId, project.id(), tag.id()),
          );
        } else if (tag.isDeleted()) {
          await manager.update(
            ProjectTagEntity,
            { projectId: project.id(), tagId: tag.id() },
            { deleted: 1, lastUpdatedBy: userId },
          );
        }
      }
    });
  }

  async delete(userId: string, project: Project): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      // 软删除项目
      await manager.update(
        ProjectEntity,
        { id: project.id() },
        { deleted: 1, lastUpdatedBy: userId },
      );

      // 软删除相关章节
      await manager.update(
        ChapterEntity,
        { projectId: project.id() },
        { deleted: 1, lastUpdatedBy: userId },
      );

      // 软删除标签关联
      await manager.update(
        ProjectTagEntity,
        { projectId: project.id() },
        { deleted: 1, lastUpdatedBy: userId },
      );
    });
  }

  async findById(id: string): Promise<Project> {
    const entity = await this.entityManager.findOne(ProjectEntity, {
      where: { id, deleted: 0 },
      relations: ['chapters', 'projectTags', 'projectTags.tag'],
    });

    if (!entity) {
      throw new Error(`Project with id ${id} not found`);
    }

    return this.toProject(entity);
  }

  async findByTitle(title: string): Promise<Project | null> {
    const entity = await this.entityManager.findOne(ProjectEntity, {
      where: { title, deleted: 0 },
      relations: ['chapters', 'projectTags', 'projectTags.tag'],
    });

    if (!entity) {
      return null;
    }

    return this.toProject(entity);
  }

  async findAll(): Promise<Project[]> {
    const entities = await this.entityManager.find(ProjectEntity, {
      where: { deleted: 0 },
      order: { createdAt: 'DESC' },
    });

    return entities.map(this.toProjectWithoutRelations);
  }

  async findListByUserId(userId: string): Promise<Project[]> {
    const entities = await this.entityManager.find(ProjectEntity, {
      where: { userId, deleted: 0 },
      order: { createdAt: 'DESC' },
    });

    return entities.map(this.toProjectWithoutRelations);
  }

  async findListByTags(tags: Tag[]): Promise<Project[]> {
    const tagIds = tags.map((tag) => tag.id());
    const projectTags = await this.entityManager.find(ProjectTagEntity, {
      where: { tagId: In(tagIds), deleted: 0 },
    });

    const projectIds = [...new Set(projectTags.map((pt) => pt.projectId))];
    const projectEntities = await this.entityManager.find(ProjectEntity, {
      where: { id: In(projectIds), deleted: 0 },
      order: { createdAt: 'DESC' },
    });

    return projectEntities.map(this.toProjectWithoutRelations);
  }

  async findListByLexile(lexile: Lexile): Promise<Project[]> {
    const projectEntities = await this.entityManager.find(ProjectEntity, {
      where: { lexileLevel: lexile.level(), deleted: 0 },
      order: { createdAt: 'DESC' },
    });

    return projectEntities.map(this.toProjectWithoutRelations);
  }

  private async toProject(entity: ProjectEntity): Promise<Project> {
    // 构建标签
    const tags = new Map<string, Tag>();
    for (const pt of entity.projectTags || []) {
      if (!pt.deleted) {
        const tag = this.tagBuilderFactory
          .create()
          .setId(pt.tag.id)
          .setName(pt.tag.name)
          .rebuild();
        tags.set(tag.name(), tag);
      }
    }

    // 构建章节
    const paramsOfAddingChapters = (entity.chapters || [])
      .filter((c) => !c.deleted)
      .sort((a, b) => a.order - b.order)
      .map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        order: c.order,
      }));

    // 构建项目
    return this.buildBasicBuilder(entity)
      .setAddChapterParamsList(paramsOfAddingChapters)
      .setTags(tags)
      .rebuild();
  }

  private toProjectWithoutRelations = (entity: ProjectEntity): Project => {
    return this.buildBasicBuilder(entity).rebuild();
  };

  private buildBasicBuilder(entity: ProjectEntity): ProjectBuilder {
    return this.buildFactory
      .create()
      .setId(entity.id)
      .setUserId(entity.userId)
      .setTitle(entity.title)
      .setLexile(Lexile.ofLevel(entity.lexileLevel))
      .setVersion(entity.version);
  }

  private buildProjectEntity(userId: string, project: Project): ProjectEntity {
    const projectEntity = new ProjectEntity();
    projectEntity.id = project.id();
    projectEntity.userId = project.userId();
    projectEntity.title = project.title();
    projectEntity.lexileLevel = project.lexile().level();
    projectEntity.version = project.version();
    projectEntity.createdBy = userId;
    projectEntity.lastUpdatedBy = userId;
    return projectEntity;
  }

  private buildChapterEntity(userId: string, chapter: Chapter): ChapterEntity {
    const chapterEntity = new ChapterEntity();
    chapterEntity.id = chapter.id();
    chapterEntity.userId = chapter.userId();
    chapterEntity.projectId = chapter.projectId();
    chapterEntity.title = chapter.title();
    chapterEntity.order = chapter.order();
    chapterEntity.createdBy = userId;
    chapterEntity.lastUpdatedBy = userId;
    return chapterEntity;
  }

  private buildProjectTagEntity(
    userId: string,
    projectId: string,
    tagId: string,
  ): ProjectTagEntity {
    const projectTagEntity = new ProjectTagEntity();
    projectTagEntity.projectId = projectId;
    projectTagEntity.tagId = tagId;
    projectTagEntity.createdBy = userId;
    projectTagEntity.lastUpdatedBy = userId;
    return projectTagEntity;
  }
}
