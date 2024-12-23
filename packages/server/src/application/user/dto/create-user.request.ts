import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequest as ICreateUserRequest } from '@oxygen-admin/shared/dto';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest implements ICreateUserRequest {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  username!: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password!: string;
}
