import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { ConfigSchema } from "./config/config.schema";
import { AppConfig } from "./config/app-config.service";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ScheduleModule } from "@nestjs/schedule";
import { GroupModule } from "./modules/group/group.module";
import { UserModule } from "./modules/user/user.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { TaskModule } from "./modules/task/task.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: (env) => ConfigSchema.parse(env),
        }),
        HealthModule, AuthModule, GroupModule, UserModule, NotificationModule, TaskModule,
        ScheduleModule.forRoot(),
    ],
    providers: [AppConfig],
    exports: [AppConfig],
})
export class AppModule { }