import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncService } from './sync.service';
import { AccountingUploaderService } from './accounting-uploader.service';
import { EnvService } from '../env/env.service';

@Injectable()
export class SyncSchedulerService {
  private readonly logger = new Logger(SyncSchedulerService.name);
  private syncIntervalId: NodeJS.Timeout | null = null;
  private uploadIntervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly syncService: SyncService,
    private readonly accountingUploader: AccountingUploaderService,
    private readonly env: EnvService,
  ) {
    this.startSchedulers();
  }

  private startSchedulers() {
    const syncInterval = this.env.get('SYNC_INTERVAL_MS');
    const uploadInterval = this.env.get('ACCOUNTING_UPLOAD_INTERVAL_MS');

    this.syncIntervalId = setInterval(() => {
      this.runSubscriptionSync();
    }, syncInterval);

    this.uploadIntervalId = setInterval(() => {
      this.runAccountingUpload();
    }, uploadInterval);

    this.logger.log(
      `Sync scheduler started: subscription sync every ${syncInterval}ms, accounting upload every ${uploadInterval}ms`,
    );
  }

  private async runSubscriptionSync() {
    try {
      await this.syncService.incrementalSync();
    } catch (error) {
      this.logger.error('Scheduled subscription sync failed', error);
    }
  }

  private async runAccountingUpload() {
    try {
      await this.accountingUploader.uploadPendingRecords();
    } catch (error) {
      this.logger.error('Scheduled accounting upload failed', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyFullSync() {
    this.logger.log('Running daily full sync');
    try {
      await this.syncService.fullSync();
    } catch (error) {
      this.logger.error('Daily full sync failed', error);
    }
  }

  onModuleDestroy() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }
    if (this.uploadIntervalId) {
      clearInterval(this.uploadIntervalId);
    }
  }
}
