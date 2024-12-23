import { uuid } from '@/common/util';
import { Tag } from '../tag';
import { Lexile } from './lexile.value-object';
import { AddChapterParams, Project } from './project';
import { ProjectTitleValidator } from './validator';

export class ProjectBuilder {
  private id!: string;
  private userId!: string;
  private title!: string;
  private addChapterParamsList: AddChapterParams[] = [];
  private tags: Map<string, Tag> = new Map();
  private lexile!: Lexile;
  private version: number = 1;

  constructor(private readonly titleValidator: ProjectTitleValidator) {}

  setId(id: string): this {
    this.id = id;
    return this;
  }

  setUserId(userId: string): this {
    this.userId = userId;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setLexile(lexile: Lexile): this {
    this.lexile = lexile;
    return this;
  }

  setAddChapterParamsList(chaptersWithoutProjectId: AddChapterParams[]): this {
    this.addChapterParamsList = chaptersWithoutProjectId;
    return this;
  }

  setTags(tags: Map<string, Tag>): this {
    this.tags = tags;
    return this;
  }

  setVersion(version: number): this {
    this.version = version;
    return this;
  }

  async build(): Promise<Project> {
    await this.validate();
    return this.withDefaultChapter(this.create());
  }

  rebuild(): Project {
    const project = this.create().toUnchanged();

    project.chapters().forEach((chapter) => chapter.toUnchanged());
    project.tags().forEach((tag) => tag.toUnchanged());

    return project;
  }

  private create(): Project {
    const project = Project.of({
      id: this.id,
      userId: this.userId,
      title: this.title,
      lexile: this.lexile,
      version: this.version,
    });

    if (this.addChapterParamsList.length) {
      this.addChapterParamsList.forEach((params) => project.addChapter(params));
    }

    if (this.tags.size) {
      this.tags.forEach((tag) => project.addTag(tag));
    }

    return project;
  }

  private withDefaultChapter(project: Project): Project {
    project.addChapter({
      id: uuid(),
      userId: this.userId,
      title: '默认章节',
      order: 0,
    });

    return project;
  }

  private async validate(): Promise<void> {
    await this.titleValidator.validate(this.id, this.title);
  }
}
