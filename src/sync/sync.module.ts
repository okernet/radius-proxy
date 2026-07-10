import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalSubscription } from 'src/entities';
import { AccountingQueue } from 'src/entities';
import { SyncStatus } from 'src/entities';
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
