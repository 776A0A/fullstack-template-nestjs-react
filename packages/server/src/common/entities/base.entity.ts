import * as moment from 'moment-timezone';
import { AfterLoad, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
      this.createdAt = this.formatAndSetTimezone(this.createdAt);
    }
    if (this.lastUpdatedAt) {
      this.lastUpdatedAt = this.formatAndSetTimezone(this.lastUpdatedAt);
    }
  }

  private formatAndSetTimezone(time: Date) {
    return moment(time)
      .tz('Asia/Shanghai')
      .format('YYYY-MM-DD HH:mm:ss') as any;
  }
}
