import { Injectable } from "@nestjs/common";
import { Prisma, Task, TaskStatus } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterTask } from "../dto/request.dto";
import { CountTask, CountTaskUser } from "../dto/response.dto";
import { includes } from "zod";
import { group } from "console";

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

    async getTaskRecent(userId: number): Promise<(Task & { group: { id: number; name: string } })[]> {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return this.prisma.task.findMany({
            where: {
                assignees: {
                    some: {
                        userId,
                    },
                },
                updatedAt: {
                    gte: oneWeekAgo,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    async getTaskUserIdAndStatus(userId: number, filter: FilterTask, status: TaskStatus):
        Promise<
            (Task & {
                group: {
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
            })[]
        > {
        const take = filter.take ?? 20;
        const cursorDate = filter.cursor ? new Date(filter.cursor) : undefined;
        const filterTask = filter.filter ?? "ALL";
        const now = new Date();
        const where: Prisma.TaskWhereInput = {
            assignees: {
                some: {
                    userId,
                },
            },
            status,
            ...(cursorDate ? { updatedAt: { lt: cursorDate } } : {}),
        };
        if (filterTask === "ACTIVE") {
            where.deadline = { gte: now };
        } else if (filterTask === "OVERDUE") {
            where.deadline = { lt: now };
            where.AND = [{ status: { not: "DONE" } }];
        }
        return this.prisma.task.findMany({
            where,
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
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
        const filterTask = filter.filter ?? "ALL";
        const now = new Date();
        const where: Prisma.TaskWhereInput = {
            groupId,
            status,
            ...(cursorDate ? { updatedAt: { lt: cursorDate } } : {}),
        };
        if (filterTask === "ACTIVE") {
            where.deadline = { gte: now };
        } else if (filterTask === "OVERDUE") {
            where.deadline = { lt: now };
            where.AND = [{ status: { not: "DONE" } }];
        }
        return this.prisma.task.findMany({
            where,
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

    async countTaskUser(userId: number): Promise<CountTaskUser> {
        const now = new Date();
        const [
            total,
            inProgress,
            done,
            overdue,
            pending,
            groups,
        ] = await Promise.all([
            this.prisma.task.count({
                where: {
                    assignees: {
                        some: {
                            userId,
                        }
                    },
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    assignees: {
                        some: {
                            userId,
                        }
                    },
                    status: "IN_PROGRESS",
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    assignees: {
                        some: {
                            userId,
                        }
                    },
                    status: "DONE",
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    assignees: {
                        some: {
                            userId,
                        }
                    },
                    deadline: {
                        lt: now,
                    },
                    status: {
                        not: "DONE"
                    },
                    deletedAt: null,
                },
            }),
            this.prisma.task.count({
                where: {
                    assignees: {
                        some: {
                            userId,
                        }
                    },
                    status: "PENDING",
                    deletedAt: null,
                },
            }),
            this.prisma.group.count({
                where: {
                    users: {
                        some: {
                            userId,
                        }
                    }
                }
            })
        ]);

        return new CountTaskUser({
            total,
            inProgress,
            done,
            overdue,
            pending,
            groups,
        });
    }
}