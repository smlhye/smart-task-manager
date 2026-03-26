import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationRepository } from "./repositories/notification.repository";
import { NotificationService } from "./services/notification.service";
import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { AppConfig } from "src/config/app-config.service";
import { NotificationController } from "./notification.controller";
import { UserRepository } from "../user/repositories/user.repository";
import { GroupRepository } from "../group/repositories/group.repository";
import { GroupUserRepository } from "../group/repositories/group-user.repository";

@Module({
    imports: [PrismaModule],
    providers: [NotificationRepository, NotificationService, WebsocketGateway, AppConfig, UserRepository, GroupRepository, GroupUserRepository],
    exports: [NotificationService, WebsocketGateway],
    controllers: [NotificationController]
})
export class NotificationModule { }