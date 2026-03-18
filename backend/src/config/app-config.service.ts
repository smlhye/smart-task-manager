import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config.schema';

@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) { }

    get NODE_ENV(): 'development' | 'production' | 'test' {
        return this.configService.getOrThrow<ConfigType['NODE_ENV']>('NODE_ENV');
    }

    get PORT(): number {
        return this.configService.getOrThrow<number>('PORT');
    }

    get ENABLE_SWAGGER(): boolean {
        return this.configService.getOrThrow<boolean>('ENABLE_SWAGGER');
    }

    get FRONTEND_URL(): string {
        return this.configService.getOrThrow<string>('FRONTEND_URL');
    }

    get RATE_LIMIT_MAX(): number {
        return this.configService.getOrThrow<number>('RATE_LIMIT_MAX');
    }

    get RATE_LIMIT_TTL(): number {
        return this.configService.getOrThrow<number>('RATE_LIMIT_TTL');
    }
}