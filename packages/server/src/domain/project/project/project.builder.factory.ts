import { Injectable } from '@nestjs/common';
import { ProjectBuilder } from './project.builder';
import { ProjectTitleValidator } from './validator';

@Injectable()
export class ProjectBuilderFactory {
  constructor(private readonly projectTitleValidator: ProjectTitleValidator) {}

  create(): ProjectBuilder {
    return new ProjectBuilder(this.projectTitleValidator);
  }
}
