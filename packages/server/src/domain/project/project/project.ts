import { AggregateRootStateful } from '@/common/framework';
import { Tag } from '../tag';
import { Chapter, ChapterParams } from './chapter';
import { Lexile } from './lexile.value-object';

interface ProjectParams {
  id: string;
  title: string;
  userId: string;
  lexile: Lexile;
  version: number;
}

export type AddChapterParams = Omit<ChapterParams, 'projectId'>;

export class Project extends AggregateRootStateful {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _lexile: Lexile;
  private _title: string;
  private readonly _chapters: Chapter[] = [];
  // 标签名 -> 标签
  private readonly _tags: Map<string, Tag> = new Map();

  private constructor(params: ProjectParams) {
    super(params.version);

    this._id = params.id;
    this._title = params.title;
    this._userId = params.userId;
    this._lexile = params.lexile;
  }

  public static of(params: ProjectParams): Project {
    return new Project(params);
  }

  id(): string {
    return this._id;
  }

  title(): string {
    return this._title;
  }

  userId(): string {
    return this._userId;
  }

  lexile(): Lexile {
    return this._lexile;
  }

  chapters(): Chapter[] {
    return this._chapters.slice();
  }

  chapter(chapterId: string): Chapter | undefined {
    return this._chapters.find((chapter) => chapter.id() === chapterId);
  }

  tags(): Map<string, Tag> {
    return new Map(this._tags);
  }

  setTitle(title: string): this {
    this._title = title;
    this.toUpdated();
    return this;
  }

  addChapter(params: AddChapterParams): void {
    const chapter = Chapter.of({ ...params, projectId: this.id() });
    this._chapters.push(chapter);
    chapter.setOrder(this._chapters.length - 1);
  }

  removeChapter(chapterId: string): void {
    this._chapters.find((chapter) => chapter.id() === chapterId)?.toDeleted();
    let order = 0;
    this._chapters.forEach((chapter) => {
      if (chapter.id() === chapterId) return;
      chapter.setOrder(order++);
    });
  }

  updateChapter(
    chapterId: string,
    req: { title?: string; order?: number },
  ): void {
    const chapter = this._chapters.find((c) => c.id() === chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    if (req.title) {
      chapter.setTitle(req.title);
    }

    if (req.order !== undefined && req.order !== chapter.order()) {
      const chapterIdx = this._chapters.findIndex(
        (c) => c.id() === chapter.id(),
      );
      this._chapters.splice(chapterIdx, 1);
      this._chapters.splice(req.order, 0, chapter);
      this._chapters.forEach((chapter, idx) => chapter.setOrder(idx));
    }
  }

  addTag(tag: Tag): void {
    this.tagShouldNotBeDuplicate(tag);
    this._tags.set(tag.name(), tag);
  }

  removeTag(tag: Tag): void {
    this._tags.get(tag.name())?.toDeleted();
  }

  private tagShouldNotBeDuplicate(tag: Tag): void {
    if (this._tags.has(tag.name())) {
      throw new Error('Tag already exists');
    }
  }
}
