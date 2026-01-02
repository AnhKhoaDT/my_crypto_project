import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { BinanceService } from '../binance/binance.service';
import { MarketGateway } from '../websocket/market.gateway';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    private readonly binanceService: BinanceService,
    private readonly marketGateway: MarketGateway,
  ) { }

  @Get('coins')
  @ApiOperation({
    summary: 'Get list of supported coins',
    description: 'Returns an array of cryptocurrency symbols that are supported by this API. Use these symbols for the price and candles endpoints.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of supported cryptocurrency symbols',
    schema: {
      example: ['BTC', 'ETH', 'SOL', 'BNB'],
    },
  })
  getCoins() {
    return this.marketService.getCoins();
  }

  @Get('price')
  @ApiOperation({
    summary: 'Get current price for a cryptocurrency',
    description: 'Fetches the current price of a cryptocurrency from Binance API. If no symbol is provided, defaults to BTC.',
  })
  @ApiQuery({
    name: 'symbol',
    required: false,
    description: 'Cryptocurrency symbol (e.g., BTC, ETH, SOL). Defaults to BTC if not provided.',
    example: 'BTC',
  })
  @ApiResponse({
    status: 200,
    description: 'Current price information',
    schema: {
      example: {
        symbol: 'BTC',
        pair: 'BTCUSDT',
        price: 42350.75,
        source: 'Binance',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid symbol or API error',
  })
  getPrice(@Query('symbol') symbol: string) {
    return this.marketService.getPrice(symbol);
  }

  @Get('candles')
  @ApiOperation({
    summary: 'Get historical candlestick data',
    description: `Fetches historical OHLCV (Open, High, Low, Close, Volume) candlestick data from Binance API.
    
**Usage Tips:**
- Use this endpoint to display price charts on the frontend
- Adjust 'interval' based on the timeframe you want to display (1m, 5m, 15m, 1h, 4h, 1d, etc.)
- Set 'count' to control how many candles to fetch (default: 100, max: 1000)
- Timestamps are in milliseconds (use new Date(timestamp) in JavaScript)

**Common intervals:**
- 1m, 3m, 5m, 15m, 30m (minutes)
- 1h, 2h, 4h, 6h, 8h, 12h (hours)  
- 1d, 3d (days)
- 1w (week)
- 1M (month)`,
  })
  @ApiQuery({
    name: 'symbol',
    required: false,
    description: 'Cryptocurrency symbol (e.g., BTC, ETH, SOL). Defaults to BTC if not provided.',
    example: 'BTC',
  })
  @ApiQuery({
    name: 'interval',
    required: false,
    description: 'Candle interval - time period for each candle. Defaults to 1h.',
    example: '1h',
  })
  @ApiQuery({
    name: 'count',
    required: false,
    description: 'Number of candles to return. Defaults to 100. Maximum: 1000.',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Array of candlestick data',
    schema: {
      example: [
        {
          time: 1703001600000,
          open: 42350.5,
          high: 42450.75,
          low: 42300.0,
          close: 42400.25,
          volume: 125.5,
        },
        {
          time: 1703005200000,
          open: 42400.25,
          high: 42500.0,
          low: 42350.5,
          close: 42475.0,
          volume: 98.3,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters or API error',
  })
  getKlines(
    @Query('symbol') symbol: string,
    @Query('interval') interval: string,
    @Query('count') count: string,
  ) {
    return this.marketService.getKlines(symbol, interval, count ? parseInt(count, 10) : undefined);
  }

  @Get('ws-stats')
  @ApiOperation({
    summary: 'Get WebSocket connection statistics',
    description: 'Returns statistics about active WebSocket connections and Binance connections',
  })
  @ApiResponse({
    status: 200,
    description: 'WebSocket statistics',
    schema: {
      example: {
        activeChannels: 3,
        totalClients: 5,
        binanceConnections: 3,
      },
    },
  })
  getWebSocketStats() {
    return this.marketGateway.getStats();
  }
}
