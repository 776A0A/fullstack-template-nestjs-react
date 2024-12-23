import { AuditableEntity } from '@/common/framework';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_v2' })
export class UserEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true })
  username!: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password!: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
