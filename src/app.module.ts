import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { EnvModule, envSchema, EnvService } from './env';
import { LocalSubscription } from './entities/subscription.entity';
import { AccountingQueue } from './entities/accounting-queue.entity';
import { SyncStatus } from './entities/sync-status.entity';
import { RadiusModule } from './radius/radius.module';
import { SyncModule } from './sync/sync.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EnvModule,
    ConfigModule.forRoot({ validate: envSchema.parse }),
    LoggerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        pinoHttp: {
          level: env.get('LOG_LEVEL'),
          transport:
            process.env.NODE_ENV !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    ignore: 'pid,hostname,context',
                    messageFormat: '\x1B[36m({context})\x1B[0m {msg}',
                    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                  },
                }
              : undefined,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        type: 'better-sqlite3',
        database: env.get('DB_PATH'),
        entities: [LocalSubscription, AccountingQueue, SyncStatus],
        synchronize: true,
        // logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    ScheduleModule.forRoot(),
    RadiusModule,
    SyncModule,
    HealthModule,
  ],
})
export class AppModule {}
