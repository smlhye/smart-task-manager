import z from "zod";

export const notificationSchema = z.object({
    id: z.number(),
    senderId: z.number().optional().nullable(),
    receiverId: z.number(),
    message: z.string(),
    type: z.string(),
    status: z.string(),
    isRead: z.boolean(),
    groupId: z.number(),
    taskId: z.number().nullable(),
    createdAt: z.string(),
})

export type NotificationType = z.infer<typeof notificationSchema>;

export const notificationItemSchema = notificationSchema.extend({
    senderFullname: z.string(),
    groupName: z.string(),
})

export const notificationListSchema = z.array(notificationItemSchema);
export type NotificationItemType = z.infer<typeof notificationItemSchema>;
export type NotificationListType = z.infer<typeof notificationListSchema>;

export const filterNotificationSchema = z.object({
    take: z.number().min(1).optional(),
    cursor: z.string().optional(),
})

export type FilterNotification = z.infer<typeof filterNotificationSchema>;

export const unreadCountSchema = z.object({
    count: z.number(),
})

export type UnreadCountType = z.infer<typeof unreadCountSchema>;