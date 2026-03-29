import { Injectable } from "@nestjs/common";
import { Prisma, TaskAssignee } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TaskAssigneeRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.TaskAssigneeCreateInput): Promise<TaskAssignee & { user: { id: number, firstName: string, lastName: string } }> {
        return this.prisma.taskAssignee.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        })
    }

    async findExisting(userId: number, taskId: number): Promise<TaskAssignee | null> {
        return this.prisma.taskAssignee.findUnique({
            where: {
                taskId_userId: {
                    userId,
                    taskId,
                }
            }
        })
    }

    async assignees(taskId: number) {
        return this.prisma.taskAssignee.findMany({
            where: {
                taskId,
            }
        })
    }

    async deleteAssignees(userIds: number[]) {
        return this.prisma.taskAssignee.deleteMany({
            where: {
                userId: {
                    in: userIds,
                }
            }
        })
    }

    async deleteAssigned(userId: number, taskId: number) {
        return this.prisma.taskAssignee.delete({
            where: {
                taskId_userId: {
                    userId,
                    taskId
                }
            }
        })
    }
}