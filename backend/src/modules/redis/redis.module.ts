import { Module } from "@nestjs/common";
import { RedisConfig } from "./services/redis.service";
import { AppConfig } from "src/config/app-config.service";

@Module({
    imports: [],
    providers: [RedisConfig, AppConfig],
    exports: [RedisConfig],
})
export class RedisModule { }