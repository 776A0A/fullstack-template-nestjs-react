import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserNameValidator {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async validate(userId: string, name: string): Promise<void> {
    this.shouldNotBeEmpty(name);
    await this.shouldNotBeDuplicate(userId, name);
  }

  private shouldNotBeEmpty(name: string): void {
    if (!name) throw new Error('Username cannot be empty');
  }

  private async shouldNotBeDuplicate(
    userId: string,
    name: string,
  ): Promise<void> {
    const duplicate = await this.userRepository.findByUsername(name);
    if (duplicate && duplicate.id() !== userId)
      throw new Error('Username already exists');
  }
}
