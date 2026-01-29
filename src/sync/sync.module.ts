import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalSubscription } from '../entities/subscription.entity';
import { AccountingQueue } from '../entities/accounting-queue.entity';
import { SyncStatus } from '../entities/sync-status.entity';
import { CloudClientService } from './cloud-client.service';
import { SyncService } from './sync.service';
import { AccountingUploaderService } from './accounting-uploader.service';
import { SyncSchedulerService } from './sync-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalSubscription, AccountingQueue, SyncStatus])],
  providers: [CloudClientService, SyncService, AccountingUploaderService, SyncSchedulerService],
  exports: [SyncService, AccountingUploaderService, CloudClientService],
})
export class SyncModule {}
