import { CreateProjectRequest as ICreateProjectRequest } from '@oxygen-admin/shared/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectRequest implements ICreateProjectRequest {
  @ApiProperty({ description: '项目标题' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title!: string;

  @ApiProperty({ description: '蓝思值' })
  @IsNumber()
  lexileLevel!: number;

  @ApiPropertyOptional({ description: '标签ID列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tagIds?: string[];
}
