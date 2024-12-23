import { AfterLoad, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { standardTimeFormat } from '../util';

export abstract class AuditableEntity {
  @CreateDateColumn({ name: 'created_at', type: 'datetime', update: false })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 36, update: false })
  createdBy!: string;

  @UpdateDateColumn({ name: 'last_updated_at', type: 'datetime' })
  lastUpdatedAt!: Date;

  @Column({ name: 'last_updated_by', type: 'varchar', length: 36 })
  lastUpdatedBy!: string;

  @Column({ name: 'deleted', type: 'tinyint', default: 0 })
  deleted!: number;

  @AfterLoad()
  convertDatesToUTC8Time(): void {
    if (this.createdAt) {
      this.createdAt = standardTimeFormat(this.createdAt) as unknown as Date;
    }
    if (this.lastUpdatedAt) {
      this.lastUpdatedAt = standardTimeFormat(
        this.lastUpdatedAt,
      ) as unknown as Date;
    }
  }
}
