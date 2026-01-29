import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AccountingQueue, AccountingQueueStatus } from '../entities/accounting-queue.entity';
import { CloudClientService } from './cloud-client.service';
import { EnvService } from '../env/env.service';
import { RadiusAccountingRequestDto } from 'src/radius/dto';

@Injectable()
export class AccountingUploaderService {
  private readonly logger = new Logger(AccountingUploaderService.name);
  private readonly maxRetries = 5;

  constructor(
    @InjectRepository(AccountingQueue)
    private readonly accountingQueueRepository: Repository<AccountingQueue>,
    private readonly cloudClient: CloudClientService,
    private readonly env: EnvService,
  ) {}

  async uploadPendingRecords(): Promise<void> {
    const batchSize = this.env.get('ACCOUNTING_BATCH_SIZE');
    const pendingRecords = await this.accountingQueueRepository.find({
      where: { status: AccountingQueueStatus.PENDING },
      order: { createdAt: 'ASC' },
      take: batchSize,
    });

    if (pendingRecords.length === 0) {
      return;
    }

    this.logger.debug(`Found ${pendingRecords.length} pending accounting records to upload`);

    await this.accountingQueueRepository.update(
      { id: In(pendingRecords.map((r) => r.id)) },
      { status: AccountingQueueStatus.UPLOADING, lastAttemptAt: new Date() },
    );

    try {
      const records: RadiusAccountingRequestDto[] = pendingRecords.map(
        (r) => JSON.parse(r.payload) as RadiusAccountingRequestDto,
      );
      const result = await this.cloudClient.uploadAccountingBatch(records);
      this.logger.log(`Uploaded ${result.processed} accounting records, ${result.failed} failed`);
      // await this.accountingQueueRepository.delete({ id: In(pendingRecords.map((r) => r.id)) });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload accounting batch: ${errorMessage}`);

      for (const record of pendingRecords) {
        const newRetryCount = record.retryCount + 1;
        const newStatus =
          newRetryCount >= this.maxRetries ? AccountingQueueStatus.FAILED : AccountingQueueStatus.PENDING;

        await this.accountingQueueRepository.update(
          { id: record.id },
          { status: newStatus, retryCount: newRetryCount, lastError: errorMessage },
        );
      }
    }
  }

  async getQueueStats(): Promise<{ pending: number; uploading: number; failed: number }> {
    const [pending, uploading, failed] = await Promise.all([
      this.accountingQueueRepository.count({ where: { status: AccountingQueueStatus.PENDING } }),
      this.accountingQueueRepository.count({ where: { status: AccountingQueueStatus.UPLOADING } }),
      this.accountingQueueRepository.count({ where: { status: AccountingQueueStatus.FAILED } }),
    ]);

    return { pending, uploading, failed };
  }

  async retryFailedRecords(): Promise<number> {
    const result = await this.accountingQueueRepository.update(
      { status: AccountingQueueStatus.FAILED },
      { status: AccountingQueueStatus.PENDING, retryCount: 0, lastError: null },
    );

    return result.affected ?? 0;
  }
}
