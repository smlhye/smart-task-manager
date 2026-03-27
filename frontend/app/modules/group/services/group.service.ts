import { parseApiResponse } from "@/app/lib/api-parser";
import http from "@/app/services/http"
import { FilterGroup, filterGroupSchema, groupCreatedSchema, GroupCreateType, groupDetailsSchema, groupSchema, groupsResponseSchema, GroupUpdateType, InviteNotificationType, searchMemberByEmailResultSchema, SearchMemberByEmailType } from "../schemas/group.schema";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { ErrorCode } from "@/app/shared/contants/error-code";
import { notificationSchema } from "../../notification/schemas/notification.schema";
import { filterMemberSearchSchema, FilterMemberSearchType, memberSearchResponseSchema } from "../../users/schemas/user.schema";
import { createdTaskSchema, CreateTaskType, filterTaskSchema, FilterTaskType, taskListSchema } from "../../tasks/schemas/task.schema";

export const groupService = {
    getGroupsApi: async (filter?: FilterGroup) => {
        const parsed = filterGroupSchema.parse(filter ?? {});
        const res = await http.get('groups', { params: parsed });
        return parseApiResponse(groupsResponseSchema, res.data);
    },

    getMemberOfGroupApi: async (groupId: number, filter?: FilterMemberSearchType) => {
        try {
            const parsed = filterMemberSearchSchema.parse(filter ?? {});
            const res = await http.get(`groups/${groupId}/members`, { params: parsed });
            return parseApiResponse(createApiResponseSchema(memberSearchResponseSchema), res.data);
        } catch (e) {
            console.log(e);
        }
    },

    getTaskPending: async (groupId: number, filter?: FilterTaskType) => {
        const parsed = filterTaskSchema.parse(filter ?? {});
        const res = await http.get(`groups/${groupId}/tasks/pending`, { params: parsed });
        return parseApiResponse(createApiResponseSchema(taskListSchema), res.data);
    },

    getTaskInProgress: async (groupId: number, filter?: FilterTaskType) => {
        const parsed = filterTaskSchema.parse(filter ?? {});
        const res = await http.get(`groups/${groupId}/tasks/in-progress`, { params: parsed });
        return parseApiResponse(createApiResponseSchema(taskListSchema), res.data);
    },

    getTaskDone: async (groupId: number, filter?: FilterTaskType) => {
        const parsed = filterTaskSchema.parse(filter ?? {});
        const res = await http.get(`groups/${groupId}/tasks/done`, { params: parsed });
        return parseApiResponse(createApiResponseSchema(taskListSchema), res.data);
    },

    createApi: async (data: GroupCreateType) => {
        try {
            const res = await http.post('groups', data);
            return parseApiResponse(createApiResponseSchema(groupCreatedSchema), res.data);
        } catch (err: any) {
            throw new Error("Không thể kết nối server");
        }
    },

    updateApi: async (data: GroupUpdateType) => {
        try {
            const res = await http.put(`groups/${data.id}`, {
                name: data.name,
            });
            return parseApiResponse(createApiResponseSchema(groupSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.GROUP_NOT_FOUND) {
                    throw new Error('Không tìm thấy nhóm này')
                }
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    getGroupByIdApi: async (groupId: number) => {
        try {
            const res = await http.get(`groups/${groupId}`);
            return parseApiResponse(createApiResponseSchema(groupDetailsSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.GROUP_NOT_FOUND) {
                    throw new Error('Nhóm này không tồn tại. Vui lòng chọn nhóm khác hoặc tạo nhóm mới');
                }
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
                throw new Error("Không thể kết nối server");
            }
        }
    },

    searchMemberByEmailApi: async (data: SearchMemberByEmailType) => {
        try {
            const res = await http.get(`groups/${data.groupId}/members/search?email=${data.email}`);
            return parseApiResponse(createApiResponseSchema(searchMemberByEmailResultSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.GROUP_NOT_FOUND) {
                    throw new Error('Nhóm này không tồn tại');
                }
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
                if (data.error?.code === ErrorCode.USER_NOT_FOUND || data.error?.code === ErrorCode.USER_INVALID) {
                    throw new Error('Người dùng không tồn tại vui lòng kiểm tra lại email')
                }
                throw new Error("Không thể kết nối server");
            }
        }
    },

    inviteMemberApi: async (data: InviteNotificationType) => {
        try {
            const res = await http.post(`groups/${data.groupId}/members/${data.receiverId}`);
            return parseApiResponse(createApiResponseSchema(notificationSchema), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.GROUP_NOT_FOUND) {
                    throw new Error('Nhóm này không tồn tại');
                }
                if (data.error?.code === ErrorCode.PERMISSION_DENIED) {
                    throw new Error('Bạn không đủ quyền, vui lòng liên hệ admin nhóm');
                }
                if (data.error?.code === ErrorCode.USER_NOT_FOUND || data.error?.code === ErrorCode.USER_INVALID) {
                    throw new Error('Người dùng không tồn tại vui lòng kiểm tra lại email')
                }
                throw new Error("Không thể kết nối server");
            }
        }
    },

    createTaskApi: async (groupId: number, data: CreateTaskType) => {
        try {
            const res = await http.post(`groups/${groupId}/tasks`, data);
            return parseApiResponse(createApiResponseSchema(createdTaskSchema), res.data);
        } catch (err: any) {
            throw new Error("Không thể kết nối server");
        }
    },
}