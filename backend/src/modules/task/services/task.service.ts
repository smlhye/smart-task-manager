import { HttpStatus, Injectable } from "@nestjs/common";
import { TaskRepository } from "../repositories/task.repository";
import { TaskAssigneeRepository } from "../repositories/task-assignee.repository";
import { CreateTask, FilterTask, UpdateTask } from "../dto/request.dto";
import { Priority, Prisma, TaskStatus } from "@prisma/client";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { CountTask, CountTaskUser, MemberAssigned, TaskCreatedSuccess, TaskItemSuccess, TaskRecentItem } from "../dto/response.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TaskChangedEvent } from "../events/task-changed.event";

@Injectable()
export class TaskService {
    constructor(
        private readonly taskRepo: TaskRepository,
        private readonly taskAssigneeRepo: TaskAssigneeRepository,
        private readonly eventEmitter: EventEmitter2,
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

        this.eventEmitter.emit('task.changed', new TaskChangedEvent(
            groupId,
            createdTask.group.name,
            createdTask.id,
            assignedMembers.map((item) => item.id),
        ));

        return TaskCreatedSuccess.fromModel(createdTask, assignedMembers);
    }

    async update(groupId: number, taskId: number, data: UpdateTask) {
        const taskUpdateData: Prisma.TaskUpdateInput = {
            title: data.title,
            description: data.description,
            status: data.status as TaskStatus,
            priority: data.priority as Priority,
            deadline: new Date(data.deadline),
            group: {
                connect: {
                    id: groupId,
                }
            }
        }
        const task = await this.taskRepo.findById(taskId);
        if (!task) throw new BaseException({
            code: ErrorCode.TASK_NOT_FOUND,
            message: 'Task is not found',
            status: HttpStatus.NOT_FOUND,
        })
        if (task.groupId !== groupId) throw new BaseException({
            code: ErrorCode.BAD_REQUEST,
            message: 'Group is not contain this task',
            status: HttpStatus.BAD_REQUEST,
        })

        // -> Check ai là người update Admin-> update full

        // -> Check thành viên nhóm update -> chỉ update nội dung -> status

        const updatedTask = await this.taskRepo.update(taskId, taskUpdateData);
        if (!updatedTask) throw new BaseException({
            code: ErrorCode.INTERNAL_ERROR,
            message: 'Server error internal',
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        })

        const assignedMembers: MemberAssigned[] = [];

        const existing = await this.taskAssigneeRepo.assignees(taskId);
        const existingIds = existing.map(e => e.userId);
        const incomingIds = data.assignees ?? [];

        const toAdd = incomingIds.filter(id => !existingIds.includes(id));
        const toDelete = existingIds.filter(id => !incomingIds.includes(id));
        const toNotify = toAdd;

        if (toDelete.length > 0) {
            await this.taskAssigneeRepo.deleteAssignees(toDelete);
        }

        for (const id of toAdd) {
            const isExisting = await this.taskAssigneeRepo.findExisting(id, updatedTask.id);
            if (!isExisting) {
                const taskAssigneeCreateData: Prisma.TaskAssigneeCreateInput = {
                    user: { connect: { id: id } },
                    task: { connect: { id: updatedTask.id } },
                };

                const taskAssignee = await this.taskAssigneeRepo.create(taskAssigneeCreateData);

                assignedMembers.push(new MemberAssigned({
                    id: taskAssignee.user.id,
                    name: `${taskAssignee.user.firstName} ${taskAssignee.user.lastName}`,
                }));
            }
        }

        this.eventEmitter.emit('task.changed', new TaskChangedEvent(
            groupId,
            updatedTask.group.name,
            updatedTask.id,
            toNotify,
        ));

        return TaskCreatedSuccess.fromModel(updatedTask, assignedMembers);
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

    async countTask(groupId: number): Promise<CountTask> {
        return this.taskRepo.countTask(groupId);
    }

    async countTaskUser(userId: number): Promise<CountTaskUser> {
        return this.taskRepo.countTaskUser(userId);
    }

    async getMyTasks(userId: number, filter: FilterTask, status: TaskStatus): Promise<TaskItemSuccess[]> {
        const tasks = await this.taskRepo.getTaskUserIdAndStatus(userId, filter, status);
        return tasks.map((item) => TaskItemSuccess.fromModel(item));
    }

    async getRecentTasks(userId: number): Promise<TaskRecentItem[]> {
        const tasks = await this.taskRepo.getTaskRecent(userId);
        return tasks.map((item) => TaskRecentItem.fromModel(item));
    }
}