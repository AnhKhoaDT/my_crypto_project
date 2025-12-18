import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MarketService {
    constructor(private readonly httpService: HttpService) { }

    getCoins() {
        return ['BTC', 'ETH', 'SOL', 'BNB'];
    }

    async getPrice(symbol: string) {
        if (!symbol) {
            // Default to BTC if no symbol
            symbol = 'BTC';
        }
        const upperSymbol = symbol.toUpperCase();
        try {
            // Try to fetch from Binance
            const pair = `${upperSymbol}USDT`;
            const { data } = await firstValueFrom(
                this.httpService.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`),
            );
            return {
                symbol: upperSymbol,
                pair: data.symbol,
                price: parseFloat(data.price),
                source: 'Binance',
            };
        } catch (error) {
            console.error(`Failed to fetch price for ${upperSymbol} from Binance, returning mock data. Error: ${error.message}`);
            // Fallback mock data
            return {
                symbol: upperSymbol,
                pair: `${upperSymbol}USDT`,
                price: Math.random() * 50000 + 1000,
                source: 'Mock',
            };
        }
    }
}
