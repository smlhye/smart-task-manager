import http from "@/app/services/http";
import { ChangePasswordFormType } from "../../auth/schemas/forgot.schema";
import { parseApiResponse } from "@/app/lib/api-parser";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { ErrorCode } from "@/app/shared/contants/error-code";

export const settingService = {
    changePasswordApi: async (data: Omit<ChangePasswordFormType, "confirmPassword" | "isLogoutAll">) => {
        try {
            const res = await http.patch("auth/change-password/form", data);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.USER_NOT_FOUND) {
                    throw new Error('Có lỗi xảy ra. Vui lòng thử lại');
                }
                if (data.error?.code === ErrorCode.AUTH_INVALID_CREDENTIALS) {
                    throw new Error('Mật khẩu cũ không đúng');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    }
}