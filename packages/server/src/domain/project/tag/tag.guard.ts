import { Injectable } from '@nestjs/common';
import { Tag } from './tag';
import { TagNameValidator } from './validator';

@Injectable()
export class TagGuard {
  constructor(private readonly nameValidator: TagNameValidator) {}

  async setName(tag: Tag, newName: string): Promise<void> {
    newName = newName.trim();
    if (newName === tag.name()) return;
    await this.nameValidator.validate(tag.id(), newName);
    tag.setName(newName);
  }
}
