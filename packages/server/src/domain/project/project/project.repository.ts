import { Tag } from '../tag';
import { Lexile } from './lexile.value-object';
import { Project } from './project';

export interface ProjectRepository {
  create(userId: string, project: Project): Promise<void>;
  update(userId: string, project: Project): Promise<void>;
  delete(userId: string, project: Project): Promise<void>;

  findById(id: string): Promise<Project>;
  findByTitle(title: string): Promise<Project | null>;

  findAll(): Promise<Project[]>;
  findListByUserId(userId: string): Promise<Project[]>;
  findListByTags(tags: Tag[]): Promise<Project[]>;
  findListByLexile(lexile: Lexile): Promise<Project[]>;
}
