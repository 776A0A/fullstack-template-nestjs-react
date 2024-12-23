import { AuditableEntity } from '@/common/framework';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChapterEntity } from './chapter.entity';
import { ProjectTagEntity } from './project-tag.entity';

@Entity({ name: 'project_v2' })
export class ProjectEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId!: string;

  @Column({ name: 'title', type: 'varchar', length: 100 })
  title!: string;

  @Column({ name: 'lexile_level', type: 'int' })
  lexileLevel!: number;

  @Column({ name: 'version', type: 'int', default: 1 })
  version!: number;

  @OneToMany(() => ChapterEntity, (chapter) => chapter.project)
  chapters!: ChapterEntity[];

  @OneToMany(() => ProjectTagEntity, (projectTag) => projectTag.project)
  projectTags!: ProjectTagEntity[];
}
