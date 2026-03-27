import { HttpStatus, Injectable } from "@nestjs/common";
import { TaskRepository } from "../repositories/task.repository";
import { TaskAssigneeRepository } from "../repositories/task-assignee.repository";
import { CreateTask } from "../dto/request.dto";
import { Priority, Prisma, TaskStatus } from "@prisma/client";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { MemberAssigned, TaskCreatedSuccess } from "../dto/response.dto";

@Injectable()
export class TaskService {
    constructor(
        private readonly taskRepo: TaskRepository,
        private readonly taskAssigneeRepo: TaskAssigneeRepository,
    ) { }

    async create(groupId: number, data: CreateTask) {
        const taskCreateData: Prisma.TaskCreateInput = {
            title: data.title,
            description: data.description,
            status: TaskStatus.PENDING,
            priority: data.priority as Priority,
            deadline: new Date(data.deadline),
            group: {
                connect: {
                    id: groupId,
                }
            }
        }
        const createdTask = await this.taskRepo.create(taskCreateData);
        if (!createdTask) throw new BaseException({
            code: ErrorCode.INTERNAL_ERROR,
            message: 'Server error internal',
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        })

        const assignedMembers: MemberAssigned[] = [];

        for (const userId of data.assignees) {
            const isExisting = await this.taskAssigneeRepo.findExisting(userId, createdTask.id);
            if (!isExisting) {
                const taskAssigneeCreateData: Prisma.TaskAssigneeCreateInput = {
                    user: { connect: { id: userId } },
                    task: { connect: { id: createdTask.id } },
                };

                const taskAssignee = await this.taskAssigneeRepo.create(taskAssigneeCreateData);

                assignedMembers.push(new MemberAssigned({
                    id: taskAssignee.user.id,
                    name: `${taskAssignee.user.firstName} ${taskAssignee.user.lastName}`,
                }));
            }
        }

        return TaskCreatedSuccess.fromModel(createdTask, assignedMembers);
    }

    async getTaskById(groupId: number, taskId: number) {
        const task = await this.taskRepo.findById(taskId);
        if (!task) throw new BaseException({
            code: ErrorCode.TASK_NOT_FOUND,
            message: 'Task is not found',
            status: HttpStatus.NOT_FOUND,
        });

        if (task.groupId !== groupId) throw new BaseException({
            code: ErrorCode.BAD_REQUEST,
            message: 'Group is not contain this task',
            status: HttpStatus.BAD_REQUEST,
        })
        const assignedMembers: MemberAssigned[] = task.assignees.map((item) =>
            new MemberAssigned({
                id: item.user.id,
                name: `${item.user.firstName} ${item.user.lastName}`,
            })
        );
        return TaskCreatedSuccess.fromModel(task, assignedMembers);
    }
}