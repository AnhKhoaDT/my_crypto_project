import { Controller, Get, Query } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) { }

  @Get('coins')
  getCoins() {
    return this.marketService.getCoins();
  }

  @Get('price')
  getPrice(@Query('symbol') symbol: string) {
    return this.marketService.getPrice(symbol);
  }
}
