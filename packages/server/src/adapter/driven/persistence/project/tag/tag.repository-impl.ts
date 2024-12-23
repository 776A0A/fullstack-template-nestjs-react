import { Tag, TagBuilderFactory, TagRepository } from '@/domain/project';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ProjectTagEntity } from '../project';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagRepositoryImpl implements TagRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly tagBuilderFactory: TagBuilderFactory,
  ) {}

  async create(userId: string, tag: Tag): Promise<void> {
    await this.entityManager.save(TagEntity, this.buildTagEntity(userId, tag));
  }

  async update(userId: string, tag: Tag): Promise<void> {
    if (tag.isUpdated()) {
      await this.entityManager.update(
        TagEntity,
        { id: tag.id() },
        { name: tag.name(), lastUpdatedBy: userId },
      );
    }
  }

  async delete(userId: string, tag: Tag): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      // 软删除标签
      await manager.update(
        TagEntity,
        { id: tag.id() },
        { deleted: 1, lastUpdatedBy: userId },
      );

      // TODO: 考虑使用领域事件的方式，通知project删除关联
      // 软删除标签关联
      await manager.update(
        ProjectTagEntity,
        { tagId: tag.id() },
        { deleted: 1, lastUpdatedBy: userId },
      );
    });
  }

  async findById(id: string): Promise<Tag> {
    const entity = await this.entityManager.findOne(TagEntity, {
      where: { id, deleted: 0 },
    });

    if (!entity) {
      throw new Error(`Tag with id ${id} not found`);
    }

    return this.toTag(entity);
  }

  async findByName(name: string): Promise<Tag | null> {
    const entity = await this.entityManager.findOne(TagEntity, {
      where: { name, deleted: 0 },
    });

    if (!entity) {
      return null;
    }

    return this.toTag(entity);
  }

  async findAll(): Promise<Tag[]> {
    const entities = await this.entityManager.find(TagEntity, {
      where: { deleted: 0 },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toTag(entity));
  }

  private toTag(entity: TagEntity): Tag {
    return this.tagBuilderFactory
      .create()
      .setId(entity.id)
      .setName(entity.name)
      .rebuild();
  }

  private buildTagEntity(userId: string, tag: Tag): TagEntity {
    const entity = new TagEntity();
    entity.id = tag.id();
    entity.name = tag.name();
    entity.createdBy = userId;
    entity.lastUpdatedBy = userId;
    return entity;
  }
}
