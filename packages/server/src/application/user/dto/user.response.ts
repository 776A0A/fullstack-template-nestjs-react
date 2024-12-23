import { User } from '@/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponse as IUserResponse } from '@oxygen-admin/shared/dto';

export class UserResponse implements IUserResponse {
  @ApiProperty({ description: '用户ID' })
  id: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  constructor(user: User) {
    this.id = user.id();
    this.username = user.username();
  }
}
