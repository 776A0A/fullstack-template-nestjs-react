import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUserRequest as IUpdateUserRequest } from '@oxygen-admin/shared/dto';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequest implements IUpdateUserRequest {
  @ApiPropertyOptional({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password!: string;
}
