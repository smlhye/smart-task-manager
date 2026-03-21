import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import http from "@/app/services/http"
import { userResponseSchema } from "../schemas/user.schema";

export const userService = {
    fetchMe: async () => {
        try {
            const res = await http.get('auth/me');
            return parseApiResponse(createApiResponseSchema(userResponseSchema), res.data);
        } catch (err) {
            
        }
    }
}