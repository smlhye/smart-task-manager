import { Injectable } from "@nestjs/common";
import { TaskRepository } from "../repositories/task.repository";
import { ApiProperty } from "@nestjs/swagger";
import { Priority, Task, TaskStatus } from "@prisma/client";

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

    constructor(partial: Partial<TaskItemSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(task: (Task & {
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
        })
    }
}