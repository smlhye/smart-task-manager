import { parseApiResponse } from "@/app/lib/api-parser";
import http from "@/app/services/http"
import { FilterGroup, filterGroupSchema, groupCreatedSchema, GroupCreateType, groupDetailsSchema, groupSchema, groupsResponseSchema, GroupUpdateType } from "../schemas/group.schema";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { ErrorCode } from "@/app/shared/contants/error-code";

export const groupService = {
    getGroupsApi: async (filter?: FilterGroup) => {
        const parsed = filterGroupSchema.parse(filter ?? {});
        const res = await http.get('groups', { params: parsed });
        return parseApiResponse(groupsResponseSchema, res.data);
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
    }
}