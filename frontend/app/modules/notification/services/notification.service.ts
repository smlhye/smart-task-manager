import http from "@/app/services/http";
import { filterGroupSchema } from "../../group/schemas/group.schema";
import { FilterNotification, notificationListSchema, unreadCountSchema } from "../schemas/notification.schema";
import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";

export const notificationService = {
    getNotificationsApi: async (filter?: FilterNotification) => {
        try {
            const parsed = filterGroupSchema.parse(filter ?? {});
            const res = await http.get('notifications', { params: parsed });
            console.log(res.data);
            
            return parseApiResponse(createApiResponseSchema(notificationListSchema), res.data);
        } catch (e) {
            console.log(e)
            throw new Error('Không thể kết nối server');
        }
    },

    countUnreadNotifications: async () => {
        try {
            const res = await http.get('notifications/unread/count');
            return parseApiResponse(createApiResponseSchema(unreadCountSchema), res.data);
        } catch (e) {
            throw new Error('Không thể kết nối server');
        }
    },

    markAsRead: async (notificationId: number) => {
        try {
            const res = await http.patch(`notifications/${notificationId}/read`);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (e) {
            throw new Error('Không thể kết nối server');
        }
    },

    acceptApi: async (notificationId: number) => {
        try {
            const res = await http.patch(`notifications/${notificationId}/accept`);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (e) {
            throw new Error('Không thể kết nối server');
        }
    },

    rejectApi: async (notificationId: number) => {
        try {
            const res = await http.patch(`notifications/${notificationId}/reject`);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (e) {
            throw new Error('Không thể kết nối server');
        }
    },

    deleteApi: async (notificationId: number) => {
        try {
            const res = await http.delete(`notifications/${notificationId}`);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (e) {
            throw new Error('Không thể kết nối server');
        }
    }
}