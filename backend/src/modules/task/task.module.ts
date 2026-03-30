import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TaskRepository } from "./repositories/task.repository";
import { TaskAssigneeRepository } from "./repositories/task-assignee.repository";
import { TaskService } from "./services/task.service";
import { TaskChangedListener } from "./events/listeners/task-changed.listener";
import { NotificationService } from "../notification/services/notification.service";
import { NotificationRepository } from "../notification/repositories/notification.repository";
import { GroupRepository } from "../group/repositories/group.repository";
import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { GroupUserRepository } from "../group/repositories/group-user.repository";
import { TaskController } from "./task.controller";

@Module({
    imports: [PrismaModule],
    providers: [TaskRepository, TaskAssigneeRepository, TaskService, TaskChangedListener, NotificationService, NotificationRepository, GroupRepository, WebsocketGateway, GroupUserRepository],
    exports: [TaskService],
    controllers: [TaskController],
})
export class TaskModule { }