import { Stateful } from '@/common/framework';

export interface ChapterParams {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  order: number;
}

export class Chapter extends Stateful {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _projectId: string;
  private _title: string;
  private _order: number;

  private constructor(params: ChapterParams) {
    super();

    this._id = params.id;
    this._userId = params.userId;
    this._projectId = params.projectId;
    this._title = params.title;
    this._order = params.order;
  }

  public static of(params: ChapterParams): Chapter {
    return new Chapter(params);
  }

  id(): string {
    return this._id;
  }

  userId(): string {
    return this._userId;
  }

  projectId(): string {
    return this._projectId;
  }

  title(): string {
    return this._title;
  }

  order(): number {
    return this._order;
  }

  setTitle(title: string): this {
    if (title !== this._title) {
      this._title = title;
      this.toUpdated();
    }
    return this;
  }

  setOrder(order: number): this {
    if (order !== this._order) {
      this._order = order;
      this.toUpdated();
    }
    return this;
  }
}
