import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const user = this.userRepository.create({
      username,
      password,
      createdBy: username,
      lastUpdatedBy: username,
    });
    return this.userRepository.save(user);
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('用户不存在');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('密码错误');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '12h',
      },
    );
    return token;
  }
}
