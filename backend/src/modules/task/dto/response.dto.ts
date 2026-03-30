import { Injectable } from "@nestjs/common";
import { TaskRepository } from "../repositories/task.repository";
import { ApiProperty } from "@nestjs/swagger";
import { Priority, Task, TaskStatus } from "@prisma/client";
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class MemberAssigned {
    @ApiProperty({ example: 1, description: 'Member assigned ID' })
    id: number;
    @ApiProperty({ example: 'Trần Văn Bánh', description: 'Member assigned fullname' })
    name: string;

    constructor(partial: Partial<MemberAssigned>) {
        Object.assign(this, partial);
    }
}

export class TaskCreatedSuccess {
    @ApiProperty({ example: 1, description: 'Task ID' })
    id: number;

    @ApiProperty({ example: 'Thiết kế UI trang Dashboard', description: 'Title' })
    title: string;

    @ApiProperty({ example: 'Tạo wireframe và mockup', description: 'Description' })
    description?: string;

    @ApiProperty({ example: TaskStatus.PENDING, description: 'Status' })
    status: string;

    @ApiProperty({ example: Priority.MEDIUM, description: 'Priority' })
    priority: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Deadline' })
    deadline: string;

    @ApiProperty({ example: [MemberAssigned], description: 'Members assigned' })
    assignees: MemberAssigned[];

    @ApiProperty({ example: new Date().toISOString(), description: 'Task created at timestamp' })
    createdAt: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Task updated at timestamp' })
    updatedAt: string;

    constructor(partial: Partial<TaskCreatedSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(task: Task, assignees: MemberAssigned[]): TaskCreatedSuccess {
        return new TaskCreatedSuccess({
            id: task.id,
            title: task.title,
            description: task.description ?? '',
            deadline: task.deadline?.toISOString(),
            status: task.status,
            priority: task.priority,
            assignees,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
        })
    }
}

export class TaskItemSuccess {
    @ApiProperty({ example: 1, description: 'Task ID' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'Thiết kế UI trang Dashboard', description: 'Title' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Tạo wireframe và mockup', description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: TaskStatus.PENDING, description: 'Status' })
    @IsString()
    status: string;

    @ApiProperty({ example: Priority.MEDIUM, description: 'Priority' })
    @IsString()
    priority: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Deadline' })
    @IsDate()
    deadline: string;

    @ApiProperty({ example: [MemberAssigned], description: 'Members assigned' })
    assignees: MemberAssigned[];

    @ApiProperty({ example: new Date().toISOString(), description: 'Task created at timestamp' })
    createdAt: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Task updated at timestamp' })
    updatedAt: string;

    @ApiProperty({ example: 1, description: 'Group ID' })
    @IsOptional()
    @IsNumber()
    groupId?: number;

    @ApiProperty({ example: 'Dev', description: 'Name of group' })
    @IsString()
    @IsOptional()
    name?: string;

    constructor(partial: Partial<TaskItemSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(task: (Task & {
        group?: {
            id: number,
            name: string,
        },
        assignees: {
            user: {
                id: number;
                firstName: string;
                lastName: string;
            };
        }[];
    })): TaskItemSuccess {
        return new TaskItemSuccess({
            id: task.id,
            title: task.title,
            description: task.description ?? '',
            deadline: task.deadline?.toISOString(),
            status: task.status,
            priority: task.priority,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            assignees: task.assignees.map((item) => {
                return new MemberAssigned({
                    id: item.user.id,
                    name: `${item.user.firstName} ${item.user.lastName}`,
                })
            }),
            groupId: task.group?.id,
            name: task.group?.name,
        })
    }
}

export class CountTask {
    @ApiProperty({ example: 10, description: "Total number of tasks" })
    total: number;

    @ApiProperty({ example: 4, description: "Number of tasks currently in progress" })
    inProgress: number;

    @ApiProperty({ example: 3, description: "Number of completed tasks" })
    done: number;

    @ApiProperty({ example: 2, description: "Number of overdue tasks (past deadline and not completed)" })
    overdue: number;

    constructor(partial: Partial<CountTask>) {
        Object.assign(this, partial);
    }
}

export class CountTaskUser {
    @ApiProperty({ example: 10, description: "Total number of tasks" })
    total: number;

    @ApiProperty({ example: 4, description: "Number of tasks currently in progress" })
    inProgress: number;

    @ApiProperty({ example: 3, description: "Number of completed tasks" })
    done: number;

    @ApiProperty({ example: 2, description: "Number of pending tasks" })
    pending: number;

    @ApiProperty({ example: 10, description: "Total groups of user" })
    groups: number;

    @ApiProperty({ example: 0, description: "Number of overdue tasks (past deadline and not completed)" })
    overdue: number;

    constructor(partial: Partial<CountTaskUser>) {
        Object.assign(this, partial);
    }
}

export class TaskRecentItem {
    @ApiProperty({ example: 1, description: 'Task ID' })
    @IsNumber()
    id: number;

    @ApiProperty({ example: 'Thiết kế UI trang Dashboard', description: 'Title' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Tạo wireframe và mockup', description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: TaskStatus.PENDING, description: 'Status' })
    @IsString()
    status: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Task created at timestamp' })
    createdAt: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Task updated at timestamp' })
    updatedAt: string;

    @ApiProperty({ example: 1, description: 'Group ID' })
    @IsOptional()
    @IsNumber()
    groupId: number;

    @ApiProperty({ example: 'Dev', description: 'Name of group' })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({ example: new Date().toISOString(), description: 'Deadline' })
    @IsDate()
    deadline: string;

    constructor(partial: Partial<TaskRecentItem>) {
        Object.assign(this, partial);
    }

    static fromModel(task: (Task & {
        group: {
            id: number,
            name: string,
        }
    })): TaskRecentItem {
        return new TaskRecentItem({
            id: task.id,
            title: task.title,
            description: task.description ?? '',
            status: task.status,
            deadline: task.deadline?.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            createdAt: task.createdAt.toISOString(),
            groupId: task.group.id,
            name: task.group.name,
        })
    }
}