import { Injectable } from '@nestjs/common';
import { UserBuilder } from './user.builder';
import { UserNameValidator } from './validator';

@Injectable()
export class UserBuilderFactory {
  constructor(private readonly userNameValidator: UserNameValidator) {}

  create(): UserBuilder {
    return new UserBuilder(this.userNameValidator);
  }
}
