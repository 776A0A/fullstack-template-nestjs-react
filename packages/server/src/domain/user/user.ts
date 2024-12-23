import { Stateful } from '@/common/framework';
import * as bcrypt from 'bcrypt';

interface UserParams {
  id: string;
  username: string;
  password: string;
}

export class User extends Stateful {
  private _id: string;
  private _username: string;
  private _password: string;

  private constructor(params: UserParams) {
    super();
    this._id = params.id;
    this._username = params.username;
    this._password = params.password;
  }

  public static of(params: UserParams): User {
    return new User(params);
  }

  id(): string {
    return this._id;
  }

  setId(id: string): this {
    this._id = id;
    return this;
  }

  username(): string {
    return this._username;
  }

  password(): string {
    return this._password;
  }

  setPassword(password: string): this {
    this._password = password;
    this.toUpdated();
    return this;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this._password);
  }
}
