import { Tag } from './tag';
import { TagNameValidator } from './validator';

export class TagBuilder {
  private id!: string;
  private name!: string;

  constructor(private readonly tagNameValidator: TagNameValidator) {}

  setId(id: string): this {
    this.id = id;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  private async validate(): Promise<void> {
    if (!this.id) throw Error('id is required');
    if (!this.name) throw Error('name is required');
    await this.tagNameValidator.validate(this.id, this.name);
  }

  private create(): Tag {
    return Tag.of({ id: this.id, name: this.name });
  }

  async build(): Promise<Tag> {
    await this.validate();
    return this.create();
  }

  rebuild(): Tag {
    return this.create().toUnchanged();
  }
}
