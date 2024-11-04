import { AfterLoad, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { standardTimeFormat } from './utils';

export abstract class BaseEntity {
  @CreateDateColumn({
    type: 'datetime',
    update: false,
    name: 'created_at',
  })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: string;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'last_updated_at',
  })
  lastUpdatedAt!: Date;

  @Column({ name: 'last_updated_by' })
  lastUpdatedBy!: string;

  @Column({ type: 'tinyint', default: 0, name: 'deleted' })
  deleted!: number;

  @AfterLoad()
  convertDatesToBeijingTime() {
    if (this.createdAt) {
      this.createdAt = standardTimeFormat(this.createdAt) as any;
    }
    if (this.lastUpdatedAt) {
      this.lastUpdatedAt = standardTimeFormat(this.lastUpdatedAt) as any;
    }
  }
}
