import { UpdateChapterRequest as IUpdateChapterRequest } from '@oxygen-admin/shared/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChapterRequest implements IUpdateChapterRequest {
  @ApiPropertyOptional({ description: '章节标题' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiPropertyOptional({ description: '章节顺序' })
  @IsOptional()
  @IsNumber()
  order?: number;
}
