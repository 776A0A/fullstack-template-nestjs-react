import { AuditableEntity } from '@/common/framework';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TagEntity } from '../../tag';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'project_tag_v2' })
export class ProjectTagEntity extends AuditableEntity {
  @PrimaryColumn({ name: 'project_id', type: 'varchar', length: 36 })
  projectId!: string;

  @PrimaryColumn({ name: 'tag_id', type: 'varchar', length: 36 })
  tagId!: string;

  @ManyToOne(() => ProjectEntity, (project) => project.projectTags)
  project!: ProjectEntity;

  @ManyToOne(() => TagEntity, (tag) => tag.projectTags)
  tag!: TagEntity;
}
