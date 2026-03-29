import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from 'ioredis';
import { AppConfig } from "src/config/app-config.service";

@Injectable()
export class RedisConfig implements OnModuleInit, OnModuleDestroy {
    public client: Redis;
    constructor(
        private readonly appConfig: AppConfig,
    ) {
        const redisUrl = this.appConfig.REDIS_URL;
        this.client = new Redis(redisUrl);
    }

    onModuleInit() {
        this.client.on('connect', () => console.log('✅ Redis connected'));
        this.client.on('error', (err) => console.error('❌ Redis error:', err));
    }

    onModuleDestroy() {
        this.client.quit();
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.client.set(key, value.toString(), 'EX', ttl || this.appConfig.CACHE_TTL);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async del(key: string) {
        await this.client.del(key);
    }

    async incr(key: string): Promise<number> {
        return await this.client.incr(key);
    }

    async expire(key: string, seconds: number) {
        await this.client.expire(key, seconds);
    }
}