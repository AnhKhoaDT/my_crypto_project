import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';

@Module({
  imports: [HttpModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule { }
