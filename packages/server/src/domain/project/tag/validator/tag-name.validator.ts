import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../tag.repository';

@Injectable()
export class TagNameValidator {
  constructor(
    @Inject('TagRepository')
    private readonly tagRepository: TagRepository,
  ) {}

  async validate(tagId: string, name: string): Promise<void> {
    this.shouldNotBeEmpty(name);
    await this.shouldNotBeDuplicate(tagId, name);
  }

  private async shouldNotBeDuplicate(
    tagId: string,
    name: string,
  ): Promise<void> {
    const duplicate = await this.tagRepository.findByName(name);
    if (duplicate && duplicate.id() !== tagId) {
      throw new Error('Tag name already exists');
    }
  }

  private shouldNotBeEmpty(name: string): void {
    if (!name.trim()) {
      throw new Error('Tag name cannot be empty');
    }
  }
}
