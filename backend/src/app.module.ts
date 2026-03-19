import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { ConfigSchema } from "./config/config.schema";
import { AppConfig } from "./config/app-config.service";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (env) => ConfigSchema.parse(env),
        }),
        HealthModule, AuthModule,
        ScheduleModule.forRoot(),
    ],
    providers: [AppConfig],
    exports: [AppConfig],
})
export class AppModule { }