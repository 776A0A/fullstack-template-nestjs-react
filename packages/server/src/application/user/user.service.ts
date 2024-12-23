import { uuid } from '@/common/util';
import {
  User,
  UserBuilderFactory,
  UserGuard,
  UserRepository,
} from '@/domain/user';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from './dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly repo: UserRepository,
    private readonly builderFactory: UserBuilderFactory,
    private readonly guard: UserGuard,
  ) {}

  async createUser(req: CreateUserRequest): Promise<void> {
    const user = await this.builderFactory
      .create()
      .setId(uuid())
      .setUsername(req.username)
      .setPassword(req.password)
      .build();

    await this.repo.create(user);
  }

  async updateUser(userId: string, req: UpdateUserRequest): Promise<void> {
    const user = await this.findUserById(userId);
    await this.guard.updatePassword(user, req.password);
    await this.repo.update(user);
  }

  async getUser(userId: string): Promise<UserResponse> {
    const user = await this.findUserById(userId);
    return new UserResponse(user);
  }

  async getUserList(): Promise<UserResponse[]> {
    const users = await this.repo.findAll();
    return users.map((user) => new UserResponse(user));
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.repo.findByUsername(username);
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
