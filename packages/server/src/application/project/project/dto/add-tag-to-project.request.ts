import { AddTagToProjectRequest as IAddTagToProjectRequest } from '@oxygen-admin/shared/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddTagToProjectRequest implements IAddTagToProjectRequest {
  @ApiProperty({ description: '标签ID' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  tagId!: string;
}
