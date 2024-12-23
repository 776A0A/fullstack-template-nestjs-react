import { User } from './user';
import { UserNameValidator } from './validator';

export class UserBuilder {
  private id!: string;
  private username!: string;
  private password!: string;

  constructor(private readonly userNameValidator: UserNameValidator) {}

  setId(id: string): this {
    this.id = id;
    return this;
  }

  setUsername(username: string): this {
    this.username = username;
    return this;
  }

  setPassword(password: string): this {
    this.password = password;
    return this;
  }

  async build(): Promise<User> {
    await this.validate();
    return this.create();
  }

  rebuild(): User {
    return this.create().toUnchanged();
  }

  private create(): User {
    const user = User.of({
      id: this.id,
      username: this.username,
      password: this.password,
    });

    return user;
  }

  private async validate(): Promise<void> {
    if (!this.id) throw new Error('User id is required');
    if (!this.password) throw new Error('User password is required');

    await this.userNameValidator.validate(this.id, this.username);
  }
}
