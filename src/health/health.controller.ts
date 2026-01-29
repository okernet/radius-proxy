import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SyncService } from '../sync/sync.service';
import { AccountingUploaderService } from '../sync/accounting-uploader.service';
import { CloudClientService } from '../sync/cloud-client.service';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  database: 'connected' | 'disconnected';
  cloud: 'connected' | 'disconnected';
}

interface SyncHealthStatus {
  subscriptions: {
    lastSyncAt: string | null;
    status: string;
    lastError: string | null;
  };
}

interface QueueHealthStatus {
  pending: number;
  uploading: number;
  failed: number;
  total: number;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly syncService: SyncService,
    private readonly accountingUploader: AccountingUploaderService,
    private readonly cloudClient: CloudClientService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Overall health status' })
  async getHealth(): Promise<HealthStatus> {
    const cloudConnected = await this.cloudClient.checkHealth();

    let status: HealthStatus['status'] = 'healthy';
    if (!cloudConnected) {
      status = 'degraded';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      database: 'connected',
      cloud: cloudConnected ? 'connected' : 'disconnected',
    };
  }

  @Get('sync')
  @ApiOkResponse({ description: 'Sync status per entity' })
  async getSyncHealth(): Promise<SyncHealthStatus> {
    const syncStatus = await this.syncService.getSyncStatus();

    return {
      subscriptions: {
        lastSyncAt: syncStatus?.lastSyncAt?.toISOString() ?? null,
        status: syncStatus?.status ?? 'unknown',
        lastError: syncStatus?.lastError ?? null,
      },
    };
  }

  @Get('queue')
  @ApiOkResponse({ description: 'Accounting queue status' })
  async getQueueHealth(): Promise<QueueHealthStatus> {
    const stats = await this.accountingUploader.getQueueStats();

    return {
      ...stats,
      total: stats.pending + stats.uploading + stats.failed,
    };
  }
}
