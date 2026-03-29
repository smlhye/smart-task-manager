import http from "@/app/services/http";
import { countTaskSchema, createdTaskSchema, CreateTaskType, TaskFormType } from "../schemas/task.schema";
import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { ErrorCode } from "@/app/shared/contants/error-code";

export const taskService = {
    createTask: async (groupId: number, data: CreateTaskType) => {
        try {
            const res = await http.post(`groups/${groupId}/tasks`, data);
            return parseApiResponse(createApiResponseSchema(createdTaskSchema), res.data);
        } catch (err: any) {
            console.log(err);
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    findTaskById: async (groupId: number, taskId: number) => {
        try {
            console.log("XIN CHÀO HELLO");
            const res = await http.get(`groups/${groupId}/tasks/${taskId}`);
            return parseApiResponse(createApiResponseSchema(createdTaskSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
                if (data.error?.code === ErrorCode.BAD_REQUEST || data.error?.code === ErrorCode.TASK_NOT_FOUND) {
                    throw new Error('Không tìm thấy nhiệm vụ trong nhóm này');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    updateTask: async (groupId: number, taskId: number, data: TaskFormType) => {
        try {
            const res = await http.put(`groups/${groupId}/tasks/${taskId}`, data);
            return parseApiResponse(createApiResponseSchema(createdTaskSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
                if (data.error?.code === ErrorCode.BAD_REQUEST || data.error?.code === ErrorCode.TASK_NOT_FOUND) {
                    throw new Error('Không tìm thấy nhiệm vụ trong nhóm này');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },
    countTaskApi: async (groupId: number) => {
        try {
            const res = await http.get(`groups/${groupId}/tasks/count`);
            return parseApiResponse(createApiResponseSchema(countTaskSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
                if (data.error?.code === ErrorCode.GROUP_NOT_FOUND) {
                    throw new Error('Không tìm thấy nhóm này');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    }
}