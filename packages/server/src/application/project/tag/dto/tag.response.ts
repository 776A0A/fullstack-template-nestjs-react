import { Tag } from '@/domain/project';
import { TagResponse as ITagResponse } from '@oxygen-admin/shared/dto';
import { ApiProperty } from '@nestjs/swagger';

export class TagResponse implements ITagResponse {
  @ApiProperty({ description: '标签ID' })
  id: string;

  @ApiProperty({ description: '标签名称' })
  name: string;

  constructor(tag: Tag) {
    this.id = tag.id();
    this.name = tag.name();
  }
}
