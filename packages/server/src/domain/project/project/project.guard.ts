import { Injectable } from '@nestjs/common';
import { Tag } from '../tag';
import { AddChapterParams, Project } from './project';
import { ProjectTitleValidator } from './validator';

@Injectable()
export class ProjectGuard {
  constructor(private readonly titleValidator: ProjectTitleValidator) {}

  async setTitle(project: Project, newTitle: string): Promise<void> {
    newTitle = newTitle.trim();
    if (newTitle === project.title()) return;
    await this.titleValidator.validate(project.id(), newTitle);
    project.setTitle(newTitle);
  }

  async addChapter(project: Project, params: AddChapterParams): Promise<void> {
    project.addChapter(params);
  }

  async removeChapter(project: Project, chapterId: string): Promise<void> {
    project.removeChapter(chapterId);
  }

  async updateChapter(
    project: Project,
    chapterId: string,
    req: { title?: string; order?: number },
  ): Promise<void> {
    if (req.order !== undefined) {
      this.chapterOrderShouldNotOutOfRange(project, req.order);
    }
    project.updateChapter(chapterId, req);
  }

  async addTag(project: Project, tag: Tag): Promise<void> {
    project.addTag(tag);
  }

  async removeTag(project: Project, tag: Tag): Promise<void> {
    project.removeTag(tag);
  }

  private chapterOrderShouldNotOutOfRange(
    project: Project,
    order: number,
  ): void {
    if (order < 0 || order >= project.chapters().length) {
      throw new Error('Invalid order value');
    }
  }
}
