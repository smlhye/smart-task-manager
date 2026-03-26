import { Injectable } from "@nestjs/common";
import { Notification, Prisma } from "@prisma/client";
import { QueryOptions } from "src/common/types/query-options";
import { PrismaService } from "src/prisma/prisma.service";
import { FilterNotification } from "../dto/request.dto";

type NotificationQueryOptions = QueryOptions<Prisma.NotificationSelect, Prisma.NotificationInclude>;

@Injectable()
export class NotificationRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data: Prisma.NotificationCreateInput): Promise<(Notification & {
        sender: { firstName: string, lastName: string } | null,
        group: { name: string } | null,
    })> {
        return this.prisma.notification.create({
            data,
            include: {
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                group: {
                    select: {
                        name: true,
                    }
                }
            },
        })
    }

    async getNotificationsByUserId(
        userId: number,
        filter: FilterNotification,
        options?: NotificationQueryOptions
    ): Promise<(Notification & {
        sender: { firstName: string, lastName: string } | null,
        group: { name: string } | null,
    })[]> {
        const take = filter.take ?? 20;
        const cursorDate = filter.cursor ? new Date(filter.cursor) : undefined;
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                group: {
                    select: {
                        name: true,
                    }
                }
            },
            take,
            ...options,
        });
    }

    async updateStatus(notificationId: number, data: Prisma.NotificationUpdateInput, options?: NotificationQueryOptions): Promise<Notification> {
        return this.prisma.notification.update({
            where: {
                id: notificationId,
            }, data, ...options,
        })
    }

    async unreadCountByUserId(userId: number): Promise<number> {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            }
        })
    }

    async markAllAsRead(userId: number) {
        return this.prisma.notification.updateMany({
            where: {
                userId, isRead: false,
            }, data: {
                isRead: true,
            }
        })
    }

    async markAsRead(notificationId: number) {
        return this.prisma.notification.update({
            where: {
                id: notificationId,
            }, data: {
                isRead: true,
            }
        })
    }

    async findById(notificationId: number, options?: NotificationQueryOptions) {
        return this.prisma.notification.findUnique({
            where: {
                id: notificationId,
            },
            ...options,
        })
    }

    async deleteById(notificationId: number) {
        return this.prisma.notification.delete({
            where: {
                id: notificationId,
            }
        })
    }
}