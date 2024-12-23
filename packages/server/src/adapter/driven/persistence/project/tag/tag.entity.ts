import { AuditableEntity } from '@/common/framework';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectTagEntity } from '../project';

@Entity({ name: 'tag_v2' })
export class TagEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name!: string;

  @OneToMany(() => ProjectTagEntity, (projectTag) => projectTag.tag)
  projectTags!: ProjectTagEntity[];
}
