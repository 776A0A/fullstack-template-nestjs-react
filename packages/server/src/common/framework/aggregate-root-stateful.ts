import { Stateful } from './stateful';

export abstract class AggregateRootStateful extends Stateful {
  protected _version: number;

  constructor(version: number) {
    super();
    this._version = version;
  }

  version(): number {
    return this._version;
  }
}
