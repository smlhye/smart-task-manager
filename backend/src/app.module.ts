import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigSchema } from "./config/config.schema";
import { AppConfig } from "./config/app-config.service";
import { HealthModule } from "./health/health.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (env) => ConfigSchema.parse(env),
        }),
        HealthModule,
    ],
    providers: [AppConfig],
    exports: [AppConfig],
})
export class AppModule { }