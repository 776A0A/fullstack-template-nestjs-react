import { Tag } from './tag';

export interface TagRepository {
  create(userId: string, tag: Tag): Promise<void>;
  update(userId: string, tag: Tag): Promise<void>;
  delete(userId: string, tag: Tag): Promise<void>;

  findById(id: string): Promise<Tag>;
  findByName(name: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
}
