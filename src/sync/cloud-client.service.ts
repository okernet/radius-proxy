import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { RadiusAccountingRequestDto } from 'src/radius/dto';

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface SyncedSubscription {
  id: string;
  username: string;
  password: string;
  isActive: boolean;
  bandwidth: string;
  updatedAt: string;
}

export interface SubscriptionSyncResponse {
  subscriptions: SyncedSubscription[];
  syncedAt: string;
}

export interface AccountingBatchResponse {
  processed: number;
  failed: number;
}

@Injectable()
export class CloudClientService {
  private readonly logger = new Logger(CloudClientService.name);
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(private readonly env: EnvService) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    this.logger.debug('Fetching new access token from Keycloak');

    const response = await fetch(`${this.env.get('OIDC_ISSUER')}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.env.get('OIDC_CLIENT_ID'),
        client_secret: this.env.get('OIDC_CLIENT_SECRET'),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(`Failed to get access token: ${response.status} ${text}`);
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = (await response.json()) as TokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    this.logger.debug('Successfully obtained access token');
    return this.accessToken;
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const url = `${this.env.get('CLOUD_API_URL')}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
      signal: AbortSignal.timeout(this.env.get('CLOUD_TIMEOUT_MS')),
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(`Cloud API error: ${response.status} ${text}`);
      throw new Error(`Cloud API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async fetchSubscriptions(since?: Date): Promise<SubscriptionSyncResponse> {
    const params = new URLSearchParams();
    if (since) {
      params.set('since', since.toISOString());
    }

    const query = params.toString();
    const path = `/api/v1/sync/subscriptions${query ? `?${query}` : ''}`;

    this.logger.debug(`Fetching subscriptions from cloud: ${path}`);
    return this.fetch<SubscriptionSyncResponse>(path);
  }

  async fetchFullSnapshot(): Promise<SubscriptionSyncResponse> {
    this.logger.debug('Fetching full subscription snapshot from cloud');
    return this.fetch<SubscriptionSyncResponse>('/api/v1/sync/full-snapshot');
  }

  async uploadAccountingBatch(records: RadiusAccountingRequestDto[]): Promise<AccountingBatchResponse> {
    this.logger.debug(`Uploading ${records.length} accounting records to cloud`);
    return this.fetch<AccountingBatchResponse>('/api/v1/sync/accounting/batch', {
      method: 'POST',
      body: JSON.stringify({ records }),
    });
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.getAccessToken();
      return true;
    } catch {
      return false;
    }
  }
}
