import http from "@/app/services/http"
import { refreshSchema } from "../schemas/refresh.schema";
import { loginResponseSchema, LoginSchemaType } from "../schemas/login.schema";
import { parseApiResponse } from "@/app/lib/api-parser";
import { ErrorCode } from "@/app/shared/contants/error-code";
import { createApiResponseSchema } from "@/app/lib/api-schema";
import { registerResponseSchema, RegisterSchemaType } from "../schemas/register.schema";
import { ChangePasswordType, SendOtpType, VerifyOtpType } from "../schemas/forgot.schema";

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
    },

    register: async (data: Omit<RegisterSchemaType, "confirmPassword">) => {
        try {
            const res = await http.post("auth/register", data);
            return parseApiResponse(registerResponseSchema, res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.USER_EMAIL_EXISTS) {
                    throw new Error('Email này đã được sử dụng')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    logoutApi: async () => {
        try {
            const res = await http.post("auth/logout");
            console.log(res.data.data);
            return res.data.data;
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.AUTH_INVALID_TOKEN) {
                    throw new Error('Đăng xuất không thành công')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    logoutAllApi: async () => {
        try {
            const res = await http.post("auth/logout/all");
            return res.data.data;
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.AUTH_INVALID_TOKEN) {
                    throw new Error('Đăng xuất không thành công')
                }
                if (data.error?.code === ErrorCode.USER_NOT_FOUND) {
                    throw new Error('Không tìm thấy người dùng này')
                }

                if (data.error?.code === ErrorCode.USER_INVALID) {
                    throw new Error('Tài khoản này đã bị khóa')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    sendOtpApi: async (data: SendOtpType) => {
        try {
            const res = await http.post("auth/send-otp", data);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.BAD_REQUEST) {
                    throw new Error('Bạn đã gửi mã OTP hơn 5 lần trong vòng 1 giờ, vui lòng thử lại sau')
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    verifyOtpApi: async (data: VerifyOtpType) => {
        try {
            const res = await http.post("auth/verify-otp", data);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (err: any) {
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.OTP_INVALID) {
                    throw new Error('OTP đã hết hạn, hoặc chưa đúng. Vui lòng thử lại sau 1 giờ');
                }
                if (data.error?.code === ErrorCode.TOO_MANY_REQUESTS) {
                    throw new Error('Bạn đã nhập sai OTP quá 5 lần. Vui lòng thử lại sau 1 giờ');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    },

    changePasswordApi: async (data: Omit<ChangePasswordType, "confirmPassword">) => {
        try {
            const res = await http.patch("auth/change-password", data);
            console.log(res);
            return parseApiResponse(createApiResponseSchema(), res.data);
        } catch (err: any) {
            console.log(err);
            if (err.response?.data) {
                const data = parseApiResponse(createApiResponseSchema(), err.response.data);
                if (data.error?.code === ErrorCode.USER_NOT_FOUND) {
                    throw new Error('Có lỗi xảy ra. Vui lòng thử lại');
                }
            }
            throw new Error("Không thể kết nối server");
        }
    }
}