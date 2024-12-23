import { Column } from 'typeorm';
import { AuditableEntity } from './auditable.entity';

export abstract class AggregateRootEntity extends AuditableEntity {
  @Column({ name: 'version', type: 'int', default: 1 })
  version!: number;
}
