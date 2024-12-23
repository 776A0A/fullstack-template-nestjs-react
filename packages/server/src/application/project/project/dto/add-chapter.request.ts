import { AddChapterRequest as IAddChapterRequest } from '@oxygen-admin/shared/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddChapterRequest implements IAddChapterRequest {
  @ApiProperty({ description: '章节标题' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title!: string;

  @ApiProperty({ description: '章节顺序' })
  @IsNumber()
  order!: number;
}
