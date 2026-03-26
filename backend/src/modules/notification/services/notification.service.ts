import { HttpStatus, Injectable } from "@nestjs/common";
import { NotificationRepository } from "../repositories/notification.repository";
import { GroupRole, NotificationStatus, NotificationType, Prisma } from "@prisma/client";
import { WebsocketGateway } from "src/websocket/websocket.gateway";
import { FilterNotification } from "../dto/request.dto";
import { NotificationItemSuccess, NotificationSuccess } from "../dto/response.dto";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { GroupRepository } from "src/modules/group/repositories/group.repository";
import { GroupUserRepository } from "src/modules/group/repositories/group-user.repository";

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly groupUserRepo: GroupUserRepository,
        private readonly groupRepo: GroupRepository,
        private readonly wsGateway: WebsocketGateway,
    ) { }

    async createInviteNotification(
        senderId: number,
        receiverId: number,
        groupId: number,
        message: string,
    ) {
        const data: Prisma.NotificationCreateInput = {
            user: {
                connect: {
                    id: receiverId,
                }
            },
            sender: {
                connect: {
                    id: senderId,
                }
            },
            group: {
                connect: {
                    id: groupId
                }
            },
            message,
            type: NotificationType.INVITE_GROUP,
            status: NotificationStatus.PENDING,
            isRead: false
        };
        const notification = await this.notificationRepo.create(data);
        const notificationItemSuccess = NotificationItemSuccess.fromModel(notification, `${notification.sender?.firstName} ${notification.sender?.lastName}`, notification.group?.name);
        this.wsGateway.emitNotification(receiverId, notificationItemSuccess)
        return notification;
    }

    async getMyNotifications(userId: number, filter: FilterNotification): Promise<NotificationSuccess[]> {
        const notifications = await this.notificationRepo.getNotificationsByUserId(userId, filter);
        const notificationsSuccess = notifications.map((notification) =>
            NotificationItemSuccess.fromModel(notification, `${notification.sender?.firstName} ${notification.sender?.lastName}`, notification.group?.name));
        return notificationsSuccess;
    }

    async unreadCountByUserId(userId: number): Promise<{ count: number }> {
        const count = await this.notificationRepo.unreadCountByUserId(userId);
        return { count };
    }

    async markAsRead(notificationId: number, userId: number): Promise<void> {
        const notification = await this.notificationRepo.findById(notificationId);

        if (!notification) {
            throw new BaseException({
                code: ErrorCode.NOTIFICATION_NOT_FOUND,
                message: 'Notification is not found',
                status: HttpStatus.NOT_FOUND,
            });
        }

        if (notification.userId !== userId) {
            throw new BaseException({
                code: ErrorCode.FORBIDDEN,
                message: "You don't have permission",
                status: HttpStatus.FORBIDDEN,
            });
        }

        await this.notificationRepo.markAsRead(notificationId);
    }

    async acceptNotification(notificationId: number, userId: number) {
        const notification = await this.notificationRepo.findById(notificationId);

        if (!notification) {
            throw new BaseException({
                code: ErrorCode.NOTIFICATION_NOT_FOUND,
                message: 'Notification is not found',
                status: HttpStatus.NOT_FOUND,
            });
        }

        if (notification.userId !== userId) {
            throw new BaseException({
                code: ErrorCode.FORBIDDEN,
                message: "You don't have permission",
                status: HttpStatus.FORBIDDEN,
            });
        }
        const data: Prisma.NotificationUpdateInput = {
            status: NotificationStatus.ACCEPTED,
            isRead: true,
        }
        await this.notificationRepo.updateStatus(notificationId, data);
        if (notification.type === NotificationType.INVITE_GROUP) {
            const isMember = await this.groupRepo.isMember(notification.groupId!, userId);
            if (!isMember) {
                const createGroupUserData: Prisma.GroupUserCreateInput = {
                    role: GroupRole.MEMBER,
                    user: {
                        connect: {
                            id: userId,
                        }
                    },
                    group: {
                        connect: {
                            id: notification.groupId!,
                        }
                    }
                }
                await this.groupUserRepo.create(createGroupUserData);
            }
        }
        return;
    }

    async rejectNotification(notificationId: number, userId: number) : Promise<void>{
        const notification = await this.notificationRepo.findById(notificationId);

        if (!notification) {
            throw new BaseException({
                code: ErrorCode.NOTIFICATION_NOT_FOUND,
                message: 'Notification is not found',
                status: HttpStatus.NOT_FOUND,
            });
        }

        if (notification.userId !== userId) {
            throw new BaseException({
                code: ErrorCode.FORBIDDEN,
                message: "You don't have permission",
                status: HttpStatus.FORBIDDEN,
            });
        }
        const data: Prisma.NotificationUpdateInput = {
            status: NotificationStatus.REJECTED,
            isRead: true,
        }
        await this.notificationRepo.updateStatus(notificationId, data);
    }

    async deleteNotification(notificationId: number, userId: number) : Promise<void>{
        const notification = await this.notificationRepo.findById(notificationId);

        if (!notification) {
            throw new BaseException({
                code: ErrorCode.NOTIFICATION_NOT_FOUND,
                message: 'Notification is not found',
                status: HttpStatus.NOT_FOUND,
            });
        }

        if (notification.userId !== userId) {
            throw new BaseException({
                code: ErrorCode.FORBIDDEN,
                message: "You don't have permission",
                status: HttpStatus.FORBIDDEN,
            });
        }
        await this.notificationRepo.deleteById(notificationId);
    }
}