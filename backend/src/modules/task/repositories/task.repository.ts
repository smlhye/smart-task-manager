import { Injectable } from "@nestjs/common";
import { Prisma, Task, TaskStatus } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterTask } from "../dto/request.dto";
import { CountTask } from "../dto/response.dto";

type TaskQueryOptions = QueryOptions<Prisma.TaskSelect, Prisma.TaskInclude>;

@Injectable()
export class TaskRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.TaskCreateInput): Promise<Task & { group: { name: string } }> {
        return this.prisma.task.create({
            data,
            include: {
                group: {
                    select: {
                        name: true,
                    }
                }
            },
        })
    }

    async update(taskId: number, data: Prisma.TaskUpdateInput, options?: TaskQueryOptions): Promise<Task & { group: { name: string } }> {
        return this.prisma.task.update({
            where: {
                id: taskId,
            },
            data,
            include: {
                group: {
                    select: {
                        name: true,
                    }
                }
            },
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

    async countTask(groupId: number): Promise<CountTask> {
        const now = new Date();
        const [
            total,
            inProgress,
            done,
            overdue,
        ] = await Promise.all([
            this.prisma.task.count({
                where: {
                    groupId,
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    groupId,
                    status: "IN_PROGRESS",
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    groupId,
                    status: "DONE",
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    groupId,
                    deadline: {
                        lt: now,
                    },
                    status: {
                        not: "DONE"
                    },
                    deletedAt: null,
                },
            }),
        ]);

        return new CountTask({
            total,
            inProgress,
            done,
            overdue,
        });
    }
}