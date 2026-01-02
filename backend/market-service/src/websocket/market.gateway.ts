import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import * as WebSocketClient from 'ws';
import { BinanceService } from '../binance/binance.service';

interface ClientSubscription {
    symbol: string;
    interval: string;
}

@WebSocketGateway({ path: '/ws/market' })
export class MarketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(MarketGateway.name);

    // Map: channel → Set of WebSocket clients
    private subscriptions = new Map<string, Set<WebSocket>>();

    // Map: WebSocket client → subscription info
    private clientInfo = new Map<WebSocket, ClientSubscription>();

    // Map: channel → Binance WebSocket connection
    private binanceConnections = new Map<string, WebSocketClient>();

    constructor(private readonly binanceService: BinanceService) { }

    handleConnection(client: WebSocket, request: any) {
        this.logger.log('Client connected');

        // Parse query params from URL
        const url = new URL(request.url, `http://${request.headers.host}`);
        const symbol = url.searchParams.get('symbol');
        const interval = url.searchParams.get('interval');

        if (!symbol || !interval) {
            client.send(
                JSON.stringify({ error: 'Missing symbol or interval parameter' }),
            );
            client.close();
            return;
        }

        this.subscribeClient(client, symbol, interval);
    }

    handleDisconnect(client: WebSocket) {
        this.logger.log('Client disconnected');
        this.unsubscribeClient(client);
    }

    private subscribeClient(
        client: WebSocket,
        symbol: string,
        interval: string,
    ) {
        const channel = this.getChannel(symbol, interval);

        // Add client to subscription set
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
        }

        this.subscriptions.get(channel).add(client);
        this.clientInfo.set(client, { symbol, interval });

        this.logger.log(`Client subscribed to ${channel}`);

        // Create Binance connection if not exists (shared across all clients)
        if (!this.binanceConnections.has(channel)) {
            this.createBinanceConnection(channel, symbol, interval);
        }
    }

    private unsubscribeClient(client: WebSocket) {
        const info = this.clientInfo.get(client);

        if (!info) return;

        const channel = this.getChannel(info.symbol, info.interval);
        const clients = this.subscriptions.get(channel);

        if (clients) {
            clients.delete(client);

            // If no more clients, close Binance connection
            if (clients.size === 0) {
                this.closeBinanceConnection(channel);
                this.subscriptions.delete(channel);
            }
        }

        this.clientInfo.delete(client);
    }

    private createBinanceConnection(
        channel: string,
        symbol: string,
        interval: string,
    ) {
        const wsUrl = this.binanceService.getBinanceWsUrl(symbol, interval);

        this.logger.log(`Creating Binance connection: ${wsUrl}`);

        const binanceWs = new WebSocketClient(wsUrl);

        binanceWs.on('open', () => {
            this.logger.log(`✅ Binance WebSocket connected: ${channel}`);
        });

        binanceWs.on('message', (data: WebSocketClient.Data) => {
            try {
                const parsed = JSON.parse(data.toString());
                const kline = parsed.k;

                const candle = {
                    timestamp: kline.t,
                    open: parseFloat(kline.o),
                    high: parseFloat(kline.h),
                    low: parseFloat(kline.l),
                    close: parseFloat(kline.c),
                    volume: parseFloat(kline.v),
                    isFinal: kline.x,
                };

                // Broadcast to all subscribed clients
                this.broadcastToChannel(channel, candle);
            } catch (error) {
                this.logger.error('Error processing Binance message:', error);
            }
        });

        binanceWs.on('error', (error) => {
            this.logger.error(`Binance WebSocket error (${channel}):`, error);
        });

        binanceWs.on('close', () => {
            this.logger.log(`Binance WebSocket closed: ${channel}`);
            this.binanceConnections.delete(channel);
        });

        this.binanceConnections.set(channel, binanceWs);
    }

    private closeBinanceConnection(channel: string) {
        const binanceWs = this.binanceConnections.get(channel);

        if (binanceWs) {
            binanceWs.close();
            this.binanceConnections.delete(channel);
            this.logger.log(`Closed Binance connection: ${channel}`);
        }
    }

    private broadcastToChannel(channel: string, data: any) {
        const clients = this.subscriptions.get(channel);

        if (clients) {
            const message = JSON.stringify(data);

            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    }

    private getChannel(symbol: string, interval: string): string {
        return `market:${symbol}:${interval}`;
    }

    // Stats endpoint
    getStats() {
        return {
            activeChannels: this.subscriptions.size,
            totalClients: this.clientInfo.size,
            binanceConnections: this.binanceConnections.size,
        };
    }
}
