import { User } from './user';

export interface UserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;

  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
}
