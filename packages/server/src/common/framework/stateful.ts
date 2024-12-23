import 'reflect-metadata';

export abstract class Stateful {
  public static readonly UNCHANGED = Symbol('UNCHANGED');
  public static readonly CREATED = Symbol('CREATED');
  public static readonly UPDATED = Symbol('UPDATED');
  public static readonly DELETED = Symbol('DELETED');

  private changingStatus: symbol = Stateful.UNCHANGED;

  toUnchanged(): this {
    this.changingStatus = Stateful.UNCHANGED;
    return this;
  }

  toCreated(): this {
    this.changingStatus = Stateful.CREATED;
    return this;
  }

  toUpdated(): this {
    this.changingStatus = Stateful.UPDATED;
    return this;
  }

  toDeleted(): this {
    this.changingStatus = Stateful.DELETED;
    return this;
  }

  isUnchanged(): boolean {
    return this.changingStatus === Stateful.UNCHANGED;
  }

  isCreated(): boolean {
    return this.changingStatus === Stateful.CREATED;
  }

  isUpdated(): boolean {
    return this.changingStatus === Stateful.UPDATED;
  }

  isDeleted(): boolean {
    return this.changingStatus === Stateful.DELETED;
  }
}
