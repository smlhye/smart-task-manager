import http from "@/app/services/http"
import { refreshSchema } from "../schemas/refresh.schema";
import { loginResponseSchema, LoginSchemaType } from "../schemas/login.schema";
import { parseApiResponse } from "@/app/lib/api-parser";
import { ErrorCode } from "@/app/shared/contants/error-code";
import { createApiResponseSchema } from "@/app/lib/api-schema";

export const authService = {
    refreshApi: async () => {
        const res = await http.post("auth/refresh");
        const parsed = refreshSchema.safeParse(res.data.data);

        if (!parsed.success) {
            throw new Error("Invalid refresh response");
        }
        return parsed.data.data;
    },

    loginApi: async (data: LoginSchemaType) => {
        try {
            const res = await http.post("auth/login", data);
            return parseApiResponse(loginResponseSchema, res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.AUTH_INVALID_CREDENTIALS) {
                    throw new Error('Tài khoản hoặc mật khẩu sai')
                }
                if (data.error?.code === ErrorCode.USER_INVALID) {
                    throw new Error('Tài khoản hoặc mật khẩu sai')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    }
}