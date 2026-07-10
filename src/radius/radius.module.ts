import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingQueue, LocalSubscription } from 'src/entities';
import { RadiusGuard } from './guards';
import { RadiusController } from './radius.controller';
import { RadiusService } from './radius.service';

@Module({
	imports: [TypeOrmModule.forFeature([LocalSubscription, AccountingQueue])],
	controllers: [RadiusController],
	providers: [RadiusService, RadiusGuard],
	exports: [RadiusService],
})
export class RadiusModule {}
