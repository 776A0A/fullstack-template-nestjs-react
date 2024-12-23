import { UpdateTagRequest as IUpdateTagRequest } from '@oxygen-admin/shared/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagRequest implements IUpdateTagRequest {
  @ApiProperty({ description: '标签名称' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name!: string;
}
