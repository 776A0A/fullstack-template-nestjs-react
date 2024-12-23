import { AuditableEntity } from '@/common/framework';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'chapter_v2' })
export class ChapterEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId!: string;

  @Column({ name: 'project_id', type: 'varchar', length: 36 })
  projectId!: string;

  @Column({ name: 'title', type: 'varchar', length: 100 })
  title!: string;

  @Column({ name: 'order', type: 'int' })
  order!: number;

  @ManyToOne(() => ProjectEntity, (project) => project.chapters)
  project!: ProjectEntity;
}
