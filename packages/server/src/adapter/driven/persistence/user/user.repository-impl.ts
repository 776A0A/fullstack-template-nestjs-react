import { User, UserBuilderFactory, UserRepository } from '@/domain/user';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly builderFactory: UserBuilderFactory,
  ) {}

  async create(user: User): Promise<void> {
    await this.entityManager.save(UserEntity, this.buildUserEntity(user));
  }

  async update(user: User): Promise<void> {
    if (user.isUpdated()) {
      await this.entityManager.update(
        UserEntity,
        { id: user.id() },
        { password: user.password() },
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.entityManager.findOne(UserEntity, {
      where: { id, deleted: 0 },
    });
    if (!entity) {
      throw new Error(`User with id ${id} not found`);
    }
    return this.toUser(entity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.entityManager.find(UserEntity, {
      where: { deleted: 0 },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toUser(entity));
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.entityManager.findOne(UserEntity, {
      where: { username, deleted: 0 },
    });
    if (!entity) return null;
    return this.toUser(entity);
  }

  private toUser(entity: UserEntity): User {
    return this.builderFactory
      .create()
      .setId(entity.id)
      .setUsername(entity.username)
      .setPassword(entity.password)
      .rebuild();
  }

  private buildUserEntity(user: User): UserEntity {
    const userId = user.id();

    const entity = new UserEntity();
    entity.id = userId;
    entity.username = user.username();
    entity.password = user.password();
    entity.createdBy = userId;
    entity.lastUpdatedBy = userId;

    return entity;
  }
}
