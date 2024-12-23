import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserGuard {
  async updatePassword(user: User, password: string): Promise<void> {
    password = password.trim();

    if (!password) {
      throw new Error('Password is required');
    }

    if (password !== user.password()) {
      user.setPassword(password);
    }
  }
}
