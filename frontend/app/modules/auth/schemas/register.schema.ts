import { createApiResponseSchema } from "@/app/lib/api-schema";
import z from "zod";

export const registerSchema = z.object({
    firstName: z
        .string({ message: "Họ là bắt buộc " })
        .min(2, "Họ phải có ít nhất 2 ký tự")
        .max(50, "Họ tối đa có 50 ký tự")
        .transform((val) => val.trim()),
    lastName: z
        .string({ message: "Tên là bắt buộc" })
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(50, "Tên tối đa 50 ký tự")
        .transform((val) => val.trim()),
    email: z
        .email("Email không hợp lệ")
        .transform((val) => val.toLowerCase().trim()),
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
    phone: z
        .string()
        .optional()
        .transform((val) => val?.trim())
        .refine((val) => {
            if (!val) return true;
            return /^\+?\d{7,15}$/.test(val);
        }, {
            message: "Số điện thoại không hợp lệ",
        }),
    dateOfBirth: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            return !isNaN(Date.parse(val));
        }, {
            message: "Ngày sinh không hợp lệ",
        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
})

export type RegisterSchemaType = z.input<typeof registerSchema>;

export const registerSuccessResponseSchema = z.object({
    id: z.number(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
})

export const registerResponseSchema = createApiResponseSchema(registerSuccessResponseSchema);
export type RegisterResponseType = z.infer<typeof registerResponseSchema>;