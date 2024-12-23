import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../project.repository';

@Injectable()
export class ProjectTitleValidator {
  constructor(
    @Inject('ProjectRepository')
    private readonly projectRepository: ProjectRepository,
  ) {}

  async validate(projectId: string, title: string): Promise<void> {
    this.shouldNotBeEmpty(title);
    await this.shouldNotBeDuplicate(projectId, title);
  }

  private async shouldNotBeDuplicate(
    projectId: string,
    title: string,
  ): Promise<void> {
    const duplicate = await this.projectRepository.findByTitle(title);
    if (duplicate && duplicate.id() !== projectId) {
      throw new Error('Project title already exists');
    }
  }

  private shouldNotBeEmpty(title: string): void {
    if (!title) {
      throw new Error('Project title cannot be empty');
    }
  }
}
