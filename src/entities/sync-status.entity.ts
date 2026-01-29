import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export enum SyncEntityType {
  SUBSCRIPTIONS = 'subscriptions',
}

export enum SyncState {
  IDLE = 'idle',
  SYNCING = 'syncing',
  ERROR = 'error',
}

@Entity('sync_status')
export class SyncStatus {
  @PrimaryColumn('varchar')
  entity: SyncEntityType;

  @Column('datetime', { nullable: true })
  lastSyncAt: Date | null;

  @Column({
    type: 'varchar',
    default: SyncState.IDLE,
  })
  status: SyncState;

  @Column('text', { nullable: true })
  lastError: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
