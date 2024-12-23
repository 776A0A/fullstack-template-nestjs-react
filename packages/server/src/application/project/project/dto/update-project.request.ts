import { UpdateProjectRequest as IUpdateProjectRequest } from '@oxygen-admin/shared/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectRequest implements IUpdateProjectRequest {
  @ApiProperty({ description: '项目标题' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  title!: string;
}
