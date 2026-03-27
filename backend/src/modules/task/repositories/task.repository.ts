import { Injectable } from "@nestjs/common";
import { Prisma, Task, TaskStatus } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterTask } from "../dto/request.dto";

type TaskQueryOptions = QueryOptions<Prisma.TaskSelect, Prisma.TaskInclude>;

@Injectable()
export class TaskRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.TaskCreateInput, options?: TaskQueryOptions): Promise<Task> {
        return this.prisma.task.create({
            data,
            ...options,
        })
    }

    async findById(taskId: number, options?: TaskQueryOptions): Promise<
        (
            Task & {
                assignees: {
                    user: {
                        id: number;
                        firstName: string;
                        lastName: string;
                    };
                }[];
            }
        ) | null
    > {
        return this.prisma.task.findUnique({
            where: {
                id: taskId,
            },
            include: {
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            }
        })
    }

    async findByGroupIdAndStatus(groupId: number, filter: FilterTask, status: TaskStatus):
        Promise<
            (Task & {
                assignees: {
                    user: {
                        id: number;
                        firstName: string;
                        lastName: string;
                    };
                }[];
            })[]
        > {
        const take = filter.take ?? 20;
        const cursorDate = filter.cursor ? new Date(filter.cursor) : undefined;
        return this.prisma.task.findMany({
            where: {
                groupId,
                status,
                ...(cursorDate ? { updatedAt: { lt: cursorDate } } : {}),
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            },
            take,
        })
    }
}