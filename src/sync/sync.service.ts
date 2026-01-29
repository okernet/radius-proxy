import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalSubscription } from '../entities/subscription.entity';
import { SyncStatus, SyncEntityType, SyncState } from '../entities/sync-status.entity';
import { CloudClientService, SyncedSubscription } from './cloud-client.service';

@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(LocalSubscription)
    private readonly subscriptionRepository: Repository<LocalSubscription>,
    @InjectRepository(SyncStatus)
    private readonly syncStatusRepository: Repository<SyncStatus>,
    private readonly cloudClient: CloudClientService,
  ) {}

  async onModuleInit() {
    await this.initializeSyncStatus();
    await this.performInitialSync();
  }

  private async initializeSyncStatus() {
    const existing = await this.syncStatusRepository.findOne({ where: { entity: SyncEntityType.SUBSCRIPTIONS } });

    if (!existing) {
      const status = new SyncStatus();
      status.entity = SyncEntityType.SUBSCRIPTIONS;
      status.status = SyncState.IDLE;
      status.lastSyncAt = null;
      await this.syncStatusRepository.save(status);
      this.logger.log('Initialized sync status for subscriptions');
    }
  }

  private async performInitialSync() {
    const status = await this.syncStatusRepository.findOne({
      where: { entity: SyncEntityType.SUBSCRIPTIONS },
    });

    if (!status?.lastSyncAt) {
      this.logger.log('No previous sync found, performing full snapshot sync');
      await this.fullSync();
    } else {
      this.logger.log(`Last sync was at ${status.lastSyncAt}, performing incremental sync`);
      await this.incrementalSync();
    }
  }

  async fullSync(): Promise<void> {
    this.logger.log('Starting full subscription sync');

    await this.updateSyncStatus(SyncState.SYNCING);

    try {
      const response = await this.cloudClient.fetchFullSnapshot();
      await this.upsertSubscriptions(response.subscriptions);
      await this.updateSyncStatus(SyncState.IDLE, new Date(response.syncedAt));

      this.logger.log(`Full sync completed: ${response.subscriptions.length} subscriptions`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Full sync failed: ${errorMessage}`);
      await this.updateSyncStatus(SyncState.ERROR, undefined, errorMessage);
      throw error;
    }
  }

  async incrementalSync(): Promise<void> {
    const status = await this.syncStatusRepository.findOne({ where: { entity: SyncEntityType.SUBSCRIPTIONS } });
    const since = status?.lastSyncAt ?? undefined;
    this.logger.debug(`Starting incremental sync since ${since?.toISOString() ?? 'beginning'}`);
    await this.updateSyncStatus(SyncState.SYNCING);

    try {
      const response = await this.cloudClient.fetchSubscriptions(since);
      await this.upsertSubscriptions(response.subscriptions);
      await this.updateSyncStatus(SyncState.IDLE, new Date(response.syncedAt));
      this.logger.log(`Incremental sync completed: ${response.subscriptions.length} subscriptions updated`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Incremental sync failed: ${errorMessage}`);
      await this.updateSyncStatus(SyncState.ERROR, undefined, errorMessage);
      throw error;
    }
  }

  private async upsertSubscriptions(subscriptions: SyncedSubscription[]): Promise<void> {
    for (const sub of subscriptions) {
      const existing = await this.subscriptionRepository.findOne({ where: { id: sub.id } });

      if (existing) {
        existing.username = sub.username;
        existing.password = sub.password;
        existing.isActive = sub.isActive;
        existing.bandwidth = sub.bandwidth;
        existing.syncedAt = new Date();
        await this.subscriptionRepository.save(existing);
      } else {
        const newSub = new LocalSubscription();
        newSub.id = sub.id;
        newSub.username = sub.username;
        newSub.password = sub.password;
        newSub.isActive = sub.isActive;
        newSub.bandwidth = sub.bandwidth;
        newSub.syncedAt = new Date();
        await this.subscriptionRepository.save(newSub);
      }
    }
  }

  private async updateSyncStatus(state: SyncState, lastSyncAt?: Date, error?: string): Promise<void> {
    await this.syncStatusRepository.update(
      { entity: SyncEntityType.SUBSCRIPTIONS },
      { status: state, ...(lastSyncAt && { lastSyncAt }), lastError: error ?? null },
    );
  }

  async getSyncStatus(): Promise<SyncStatus | null> {
    return this.syncStatusRepository.findOne({ where: { entity: SyncEntityType.SUBSCRIPTIONS } });
  }
}
