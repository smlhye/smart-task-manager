import z from "zod";

export const sendOtpSchema = z.object({
    email: z.email({ message: 'Email không hợp lệ' }),
})

export const verifyOtpSchema = z.object({
    email: z.email({ message: 'Email không hợp lệ' }),
    otp: z.string().length(6, "OTP phải đủ 6 ký tự"),
})

export const changePasswordSchema = z.object({
    email: z.email({ message: 'Email không hợp lệ' }),
    password: z
        .string({ message: "Mật khẩu là bắt buộc" })
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(32, "Mật khẩu tối đa 50 ký tự")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Mật khẩu có ít nhất 1 ký tự thường, 1 ký tự in hoa và 1 ký tự số"
        ),
    confirmPassword: z.string({ message: "Mật khẩu xác nhận là bắt buộc" })
        .min(1, "Mật khẩu xác nhận là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
})

export type SendOtpType = z.input<typeof sendOtpSchema>;
export type VerifyOtpType = z.input<typeof verifyOtpSchema>;
export type ChangePasswordType = z.input<typeof changePasswordSchema>;

export const changePasswordFormSchema = z.object({
    isLogoutAll: z.boolean(),
    oldPassword: z
        .string({ message: "Mật khẩu là bắt buộc" })
        .min(1, "Mật khẩu là bắt buộc"),
    password: z
        .string({ message: "Mật khẩu là bắt buộc" })
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(32, "Mật khẩu tối đa 50 ký tự")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Mật khẩu có ít nhất 1 ký tự thường, 1 ký tự in hoa và 1 ký tự số"
        ),
    confirmPassword: z.string({ message: "Mật khẩu xác nhận là bắt buộc" })
        .min(1, "Mật khẩu xác nhận là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
})

export type ChangePasswordFormType = z.infer<typeof changePasswordFormSchema>;