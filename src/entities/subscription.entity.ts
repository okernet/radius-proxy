import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class LocalSubscription {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar', { unique: true })
  username: string;

  @Column('varchar')
  password: string;

  @Column('boolean')
  isActive: boolean;

  @Column('varchar')
  bandwidth: string;

  @Column('datetime')
  syncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
