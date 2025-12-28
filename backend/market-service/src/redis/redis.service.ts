import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
        const port = parseInt(this.configService.get<string>('REDIS_PORT') ?? '6379');

        console.log(`Connecting to Redis at ${host}:${port}...`);
        this.client = new Redis({
            host,
            port,
            lazyConnect: true,
            retryStrategy: () => null, // Disable auto-retry
            maxRetriesPerRequest: null,
        });

        this.client.on('connect', () => {
            console.log('Successfully connected to Redis');
        });

        // Try to connect once
        this.client.connect().catch((err) => {
            if ((err as any).code === 'ECONNREFUSED') {
                console.warn(`[Redis] Connection refused at ${host}:${port}. Redis is not available. Continuing without Redis.`);
            } else {
                console.error('[Redis] Connection error:', err.message);
            }
        });
    }

    onModuleDestroy() {
        if (this.client) {
            this.client.quit();
        }
    }

    getClient(): Redis {
        return this.client;
    }
}
