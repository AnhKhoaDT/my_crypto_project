import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    isFinal: boolean;
}

@Injectable()
export class BinanceService {
    private readonly logger = new Logger(BinanceService.name);
    private readonly baseURL = 'https://api.binance.com';

    constructor(private readonly httpService: HttpService) { }

    /**
     * Get historical candles from Binance
     */
    async getHistoricalCandles(
        symbol: string,
        interval: string,
        limit: number = 1000,
    ): Promise<Candle[]> {
        try {
            const url = `${this.baseURL}/api/v3/klines`;
            const params = {
                symbol: symbol.toUpperCase(),
                interval,
                limit: Math.min(limit, 1000),
            };

            this.logger.log(`Fetching candles: ${symbol} ${interval} (${limit})`);

            const response = await firstValueFrom(
                this.httpService.get(url, { params }),
            );

            return response.data.map((candle: any[]) => ({
                timestamp: candle[0],
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
                volume: parseFloat(candle[5]),
                isFinal: true,
            }));
        } catch (error) {
            this.logger.error(`Binance API error: ${error.message}`);
            throw new Error(`Failed to fetch candles: ${error.message}`);
        }
    }

    /**
     * Get all available trading symbols
     */
    async getSymbols(): Promise<string[]> {
        try {
            const url = `${this.baseURL}/api/v3/exchangeInfo`;

            const response = await firstValueFrom(this.httpService.get(url));

            return response.data.symbols
                .filter((s: any) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
                .map((s: any) => s.symbol)
                .slice(0, 100); // Top 100 symbols
        } catch (error) {
            this.logger.error(`Binance API error: ${error.message}`);
            throw new Error(`Failed to fetch symbols: ${error.message}`);
        }
    }

    /**
     * Get current price for a symbol
     */
    async getCurrentPrice(symbol: string): Promise<number> {
        try {
            const url = `${this.baseURL}/api/v3/ticker/price`;
            const params = { symbol: symbol.toUpperCase() };

            const response = await firstValueFrom(
                this.httpService.get(url, { params }),
            );

            return parseFloat(response.data.price);
        } catch (error) {
            this.logger.error(`Binance API error: ${error.message}`);
            throw new Error(`Failed to fetch price: ${error.message}`);
        }
    }

    /**
     * Get Binance WebSocket URL for kline stream
     */
    getBinanceWsUrl(symbol: string, interval: string): string {
        return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    }
}
