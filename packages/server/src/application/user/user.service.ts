import { UserEntity } from '@/domain/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register({ username, password }: RegisterUserDto) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) throw new Error('用户名已存在');

    const id = uuid();
    const newUser = this.userRepository.create({
      id,
      username,
      password,
      createdBy: id,
      lastUpdatedBy: id,
    });

    await this.userRepository.save(newUser);
  }

  async login({ username, password }: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new Error('用户不存在');

    const matched = await user.comparePassword(password);
    if (!matched) throw new Error('密码错误');

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return token;
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }
}
