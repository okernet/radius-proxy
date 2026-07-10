import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingQueue, LocalSubscription, SyncStatus } from 'src/entities';
import { AccountingUploaderService } from './accounting-uploader.service';
import { CloudClientService } from './cloud-client.service';
import { SyncService } from './sync.service';
import { SyncSchedulerService } from './sync-scheduler.service';

@Module({
	imports: [TypeOrmModule.forFeature([LocalSubscription, AccountingQueue, SyncStatus])],
	providers: [CloudClientService, SyncService, AccountingUploaderService, SyncSchedulerService],
	exports: [SyncService, AccountingUploaderService, CloudClientService],
})
export class SyncModule {}
