import { ApiProperty } from '@nestjs/swagger';
import { Notification, NotificationStatus, NotificationType } from '@prisma/client';

export class NotificationSuccess {
    @ApiProperty({ description: 'Notification ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'ID of the sender', required: false, nullable: true, example: 5 })
    senderId?: number;

    @ApiProperty({ description: 'ID of the receiver', example: 2 })
    receiverId: number;

    @ApiProperty({ description: 'Notification message', example: 'You have been invited to group 1' })
    message: string;

    @ApiProperty({ description: 'Type of the notification', enum: NotificationType, example: NotificationType.INVITE_GROUP })
    type: NotificationType;

    @ApiProperty({ description: 'Status of the notification', enum: NotificationStatus, example: NotificationStatus.PENDING })
    status: NotificationStatus;

    @ApiProperty({ description: 'Whether the notification has been read', example: false })
    isRead: boolean;

    @ApiProperty({ description: 'Related group ID, if any', required: false, nullable: true, example: 3 })
    groupId?: number | null;

    @ApiProperty({ description: 'Related task ID, if any', required: false, nullable: true, example: 1 })
    taskId?: number | null;

    @ApiProperty({ description: 'Timestamp when the notification was created', example: '2026-03-25T10:20:30.000Z' })
    createdAt: string;

    constructor(partial: Partial<NotificationSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(notification: Notification): NotificationSuccess {
        return new NotificationSuccess({
            id: notification.id,
            senderId: notification.senderId ?? undefined,
            receiverId: notification.userId,
            message: notification.message,
            type: notification.type,
            status: notification.status,
            taskId: notification.taskId,
            isRead: notification.isRead,
            groupId: notification.groupId ?? undefined,
            createdAt: notification.createdAt.toISOString(),
        });
    }
}

export class NotificationItemSuccess {
    @ApiProperty({ description: 'Notification ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'ID of the sender', required: false, nullable: true, example: 5 })
    senderId?: number;

    @ApiProperty({ description: 'Full name of the sender', required: false, nullable: true, example: 'Trần Văn Bánh' })
    senderFullname?: string;

    @ApiProperty({ description: 'ID of the receiver', example: 2 })
    receiverId: number;

    @ApiProperty({ description: 'Notification message', example: 'You have been invited to group 1' })
    message: string;

    @ApiProperty({ description: 'Type of the notification', enum: NotificationType, example: NotificationType.INVITE_GROUP })
    type: NotificationType;

    @ApiProperty({ description: 'Status of the notification', enum: NotificationStatus, example: NotificationStatus.PENDING })
    status: NotificationStatus;

    @ApiProperty({ description: 'Whether the notification has been read', example: false })
    isRead: boolean;

    @ApiProperty({ description: 'Related group ID, if any', required: false, nullable: true, example: 1 })
    groupId?: number | null;

    @ApiProperty({ description: 'Related task ID, if any', required: false, nullable: true, example: 1 })
    taskId?: number | null;

    @ApiProperty({ description: 'Name of group', required: false, nullable: true, example: 'Nhóm ABC' })
    groupName?: string | null;

    @ApiProperty({ description: 'Timestamp when the notification was created', example: '2026-03-25T10:20:30.000Z' })
    createdAt: string;

    constructor(partial: Partial<NotificationItemSuccess>) {
        Object.assign(this, partial);
    }

    static fromModel(notification: Notification, fullName?: string, groupName?: string): NotificationItemSuccess {
        return new NotificationItemSuccess({
            id: notification.id,
            senderId: notification.senderId ?? undefined,
            senderFullname: notification.senderName ?? fullName,
            receiverId: notification.userId,
            message: notification.message,
            type: notification.type,
            status: notification.status,
            taskId: notification.taskId,
            isRead: notification.isRead,
            groupId: notification.groupId ?? undefined,
            groupName: groupName,
            createdAt: notification.createdAt.toISOString(),
        });
    }
}