import { parseApiResponse } from "@/app/lib/api-parser";
import http from "@/app/services/http"
import { FilterGroup, filterGroupSchema, groupCreatedSchema, GroupCreateType, groupsResponseSchema } from "../schemas/group.schema";
import { createApiResponseSchema } from "@/app/lib/api-schema";

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
    }
}