import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RadiusController } from './radius.controller';
import { RadiusService } from './radius.service';
import { LocalSubscription } from 'src/entities';
import { AccountingQueue } from 'src/entities';
import { RadiusGuard } from './guards';

@Module({
  imports: [TypeOrmModule.forFeature([LocalSubscription, AccountingQueue])],
  controllers: [RadiusController],
  providers: [RadiusService, RadiusGuard],
  exports: [RadiusService],
})
export class RadiusModule {}
