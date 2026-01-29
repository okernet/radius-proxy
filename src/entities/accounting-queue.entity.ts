import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum AccountingQueueStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  FAILED = 'failed',
}

@Entity('accounting_queue')
export class AccountingQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  payload: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { default: 0 })
  retryCount: number;

  @Column({ type: 'varchar', default: AccountingQueueStatus.PENDING })
  status: AccountingQueueStatus;

  @Column('datetime', { nullable: true })
  lastAttemptAt: Date | null;

  @Column('text', { nullable: true })
  lastError: string | null;
}
