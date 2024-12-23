import { uuid } from '@/common/util';
import {
  Lexile,
  Project,
  ProjectBuilderFactory,
  ProjectGuard,
  ProjectRepository,
  Tag,
} from '@/domain/project';
import { CreateOperationResponse } from '@oxygen-admin/shared/dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TagService } from '../tag';
import {
  AddChapterRequest,
  CreateProjectRequest,
  ProjectResponse,
  UpdateChapterRequest,
  UpdateProjectRequest,
} from './dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('ProjectRepository')
    private readonly repo: ProjectRepository,
    private readonly builderFactory: ProjectBuilderFactory,
    private readonly guard: ProjectGuard,
    private readonly tagService: TagService,
  ) {}

  async createProject(
    userId: string,
    req: CreateProjectRequest,
  ): Promise<CreateOperationResponse> {
    const project = await this.builderFactory
      .create()
      .setId(uuid())
      .setUserId(userId)
      .setTitle(req.title)
      .setLexile(Lexile.ofLevel(req.lexileLevel))
      .build();

    if (req.tagIds?.length) {
      for (const tagId of req.tagIds) {
        const tag = await this.findTagById(tagId);
        await this.guard.addTag(project, tag);
      }
    }

    await this.repo.create(userId, project);

    return { id: project.id() };
  }

  async updateProject(
    userId: string,
    projectId: string,
    req: UpdateProjectRequest,
  ): Promise<void> {
    const project = await this.findProjectById(projectId);
    await this.guard.setTitle(project, req.title);
    await this.repo.update(userId, project);
  }

  async addChapter(
    userId: string,
    projectId: string,
    req: AddChapterRequest,
  ): Promise<CreateResponse> {
    const project = await this.findProjectById(projectId);

    const chapterId = uuid();
    await this.guard.addChapter(project, {
      id: chapterId,
      userId,
      title: req.title,
      order: req.order,
    });
    await this.repo.update(userId, project);

    return { id: chapterId };
  }

  async updateChapter(
    userId: string,
    projectId: string,
    chapterId: string,
    req: UpdateChapterRequest,
  ): Promise<void> {
    const project = await this.findProjectById(projectId);
    await this.guard.updateChapter(project, chapterId, {
      title: req.title,
      order: req.order,
    });
    await this.repo.update(userId, project);
  }

  async removeChapter(
    userId: string,
    projectId: string,
    chapterId: string,
  ): Promise<void> {
    const project = await this.findProjectById(projectId);
    await this.guard.removeChapter(project, chapterId);
    await this.repo.update(userId, project);
  }

  async addTagToProject(
    userId: string,
    projectId: string,
    tagId: string,
  ): Promise<void> {
    const [project, tag] = await Promise.all([
      this.findProjectById(projectId),
      this.findTagById(tagId),
    ]);

    await this.guard.addTag(project, tag);
    await this.repo.update(userId, project);
  }

  async removeTagFromProject(
    userId: string,
    projectId: string,
    tagId: string,
  ): Promise<void> {
    const [project, tag] = await Promise.all([
      this.findProjectById(projectId),
      this.findTagById(tagId),
    ]);

    await this.guard.removeTag(project, tag);
    await this.repo.update(userId, project);
  }

  async getProject(projectId: string): Promise<ProjectResponse> {
    const project = await this.findProjectById(projectId);
    return new ProjectResponse(project);
  }

  async getProjectList(userId?: string): Promise<ProjectResponse[]> {
    const projects = userId
      ? await this.repo.findListByUserId(userId)
      : await this.repo.findAll();

    return projects.map((project) => new ProjectResponse(project));
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    const project = await this.findProjectById(projectId);
    await this.repo.delete(userId, project);
  }

  private async findProjectById(id: string): Promise<Project> {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  private async findTagById(id: string): Promise<Tag> {
    return await this.tagService.findTagDomainById(id);
  }
}
