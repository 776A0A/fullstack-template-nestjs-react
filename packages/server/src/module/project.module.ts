import {
  ProjectEntity,
  ProjectRepositoryImpl,
  ProjectTagEntity,
} from '@/adapter/driven/persistence/project/project';
import { ProjectController } from '@/adapter/driving/restful/project';
import { ProjectService } from '@/application/project';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, ProjectTagEntity])],
  providers: [
    ProjectService,
    { provide: 'ProjectRepository', useClass: ProjectRepositoryImpl },
  ],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
