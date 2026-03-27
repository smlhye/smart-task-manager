import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TaskRepository } from "./repositories/task.repository";
import { TaskAssigneeRepository } from "./repositories/task-assignee.repository";
import { TaskService } from "./services/task.service";

@Module({
    imports: [PrismaModule],
    providers: [TaskRepository, TaskAssigneeRepository, TaskService],
    exports: [TaskService],
    controllers: [],
})
export class TaskModule { }