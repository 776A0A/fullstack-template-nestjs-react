import { Stateful } from '@/common/framework';

interface TagParams {
  id: string;
  name: string;
}

export class Tag extends Stateful {
  private readonly _id: string;
  private _name: string;

  private constructor(params: TagParams) {
    super();

    this._id = params.id;
    this._name = params.name;
  }

  public static of(params: TagParams): Tag {
    return new Tag(params);
  }

  id(): string {
    return this._id;
  }

  name(): string {
    return this._name;
  }

  setName(name: string): this {
    if (name === this._name) return this;
    this._name = name;
    this.toUpdated();
    return this;
  }
}
