import { Project } from '@/domain/project';
import {
  ChapterResponse,
  ProjectResponse as IProjectResponse,
  TagResponse,
} from '@oxygen-admin/shared/dto';

export class ProjectResponse implements IProjectResponse {
  id: string;
  title: string;
  userId: string;
  lexileLevel: number;
  tags: TagResponse[];
  chapters: ChapterResponse[];

  constructor(project: Project) {
    this.id = project.id();
    this.title = project.title();
    this.userId = project.userId();
    this.lexileLevel = project.lexile().level();
    this.tags = Array.from(project.tags().values()).map((tag) => ({
      id: tag.id(),
      name: tag.name(),
    }));
    this.chapters = project.chapters().map((chapter) => ({
      id: chapter.id(),
      title: chapter.title(),
      order: chapter.order(),
    }));
  }
}
