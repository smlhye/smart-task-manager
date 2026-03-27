import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { GroupRepository } from "./repositories/group.repository";
import { GroupService } from "./services/group.service";
import { GroupController } from "./group.controller";
import { GroupUserRepository } from "./repositories/group-user.repository";
import { UserRepository } from "../user/repositories/user.repository";
import { NotificationService } from "../notification/services/notification.service";
import { NotificationRepository } from "../notification/repositories/notification.repository";
import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { AppConfig } from "src/config/app-config.service";
import { TaskService } from "../task/services/task.service";
import { TaskRepository } from "../task/repositories/task.repository";
import { TaskAssigneeRepository } from "../task/repositories/task-assignee.repository";

@Module({
    imports: [PrismaModule],
    providers: [GroupService, GroupRepository, GroupUserRepository, 
        UserRepository, NotificationService, NotificationRepository, WebsocketGateway, AppConfig, TaskService, TaskRepository, TaskAssigneeRepository],
    controllers: [GroupController],
    exports: [GroupService]
})
export class GroupModule { }