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
    }

    async getKlines(symbol: string, interval: string = '1h', limit: number = 100) {
        if (!symbol) symbol = 'BTC';
        const upperSymbol = symbol.toUpperCase();
        const pair = `${upperSymbol}USDT`;

        const { data } = await firstValueFrom(
            this.httpService.get(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`),
        );

        // Binance returns array of arrays: [ [Open Time, Open, High, Low, Close, Volume, ...], ... ]
        return data.map(item => ({
            time: item[0],
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
            volume: parseFloat(item[5]),
        }));
    }
}
