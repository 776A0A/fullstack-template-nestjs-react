import { uuid } from '@/common/util';
import {
  Tag,
  TagBuilderFactory,
  TagGuard,
  TagRepository,
} from '@/domain/project';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOperationResponse } from '@oxygen-admin/shared/dto';
import { CreateTagRequest, TagResponse, UpdateTagRequest } from './dto';

@Injectable()
export class TagService {
  constructor(
    @Inject('TagRepository')
    private readonly repo: TagRepository,
    private readonly builderFactory: TagBuilderFactory,
    private readonly guard: TagGuard,
  ) {}

  async createTag(
    userId: string,
    req: CreateTagRequest,
  ): Promise<CreateOperationResponse> {
    const tag = await this.builderFactory
      .create()
      .setId(uuid())
      .setName(req.name)
      .build();

    await this.repo.create(userId, tag);

    return { id: tag.id() };
  }

  async updateTag(
    userId: string,
    tagId: string,
    req: UpdateTagRequest,
  ): Promise<void> {
    const tag = await this.findTagDomainById(tagId);
    await this.guard.setName(tag, req.name);
    await this.repo.update(userId, tag);
  }

  async deleteTag(userId: string, tagId: string): Promise<void> {
    const tag = await this.findTagDomainById(tagId);
    await this.repo.delete(userId, tag);
  }

  async getTag(tagId: string): Promise<TagResponse> {
    const tag = await this.findTagDomainById(tagId);
    return new TagResponse(tag);
  }

  async getTagList(): Promise<TagResponse[]> {
    const tags = await this.repo.findAll();
    return tags.map((tag) => new TagResponse(tag));
  }

  async findTagDomainById(id: string): Promise<Tag> {
    const tag = await this.repo.findById(id);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return tag;
  }
}
