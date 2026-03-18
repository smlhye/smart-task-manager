import { z } from 'zod';

export const ConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    ENABLE_SWAGGER: z.coerce.boolean().default(true),

    DATABASE_URL: z.string().url(),
    DB_POOL_MIN: z.coerce.number().default(2),
    DB_POOL_MAX: z.coerce.number().default(10),
    DB_LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),

    JWT_SECRET: z.string().min(32),
    JWT_EXPIRATION: z.string().default('1h'),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_EXPIRATION: z.string().default('7d'),

    REDIS_URL: z.string().url(),
    CACHE_TTL: z.coerce.number().default(600),

    RATE_LIMIT_MAX: z.coerce.number().default(100),
    RATE_LIMIT_TTL: z.coerce.number().default(60),

    FRONTEND_URL: z.string().url().default('http://localhost:3001'),
})

export type ConfigType = z.infer<typeof ConfigSchema>