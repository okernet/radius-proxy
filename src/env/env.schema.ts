import { z } from 'zod';

export const envSchema = z.object({
	// App
	PORT: z.coerce.number().int().positive().optional().default(3080),
	HOST: z.string().optional().default('0.0.0.0'),
	LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('debug'),

	// It's unrecommended to change the timezone since the cloud API uses UTC timezone for all datetime values
	TZ: z.string().optional().default('UTC'),

	// OkerCloud Auth (for cloud sync)
	TENANT_ID: z.uuid(),
	PARTNER_ID: z.uuid(),
	OIDC_ISSUER: z.url(),
	OIDC_CLIENT_ID: z.string(),
	OIDC_CLIENT_SECRET: z.string(),

	// Cloud Connection
	CLOUD_API_URL: z.url().transform((url) => url.replace(/\/+$/, '')),
	CLOUD_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),

	// Sync Settings
	SYNC_INTERVAL_MS: z.coerce.number().int().positive().default(60000),
	ACCOUNTING_UPLOAD_INTERVAL_MS: z.coerce.number().int().positive().default(10000),
	ACCOUNTING_BATCH_SIZE: z.coerce.number().int().positive().default(100),

	// Database
	DB_PATH: z.string().default('./data/radius-proxy.sqlite'),

	// RADIUS Auth (local API key)
	RADIUS_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
