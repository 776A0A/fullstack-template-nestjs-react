import { Injectable } from '@nestjs/common';
import { TagBuilder } from './tag.builder';
import { TagNameValidator } from './validator';

@Injectable()
export class TagBuilderFactory {
  constructor(private readonly tagNameValidator: TagNameValidator) {}

  create(): TagBuilder {
    return new TagBuilder(this.tagNameValidator);
  }
}
