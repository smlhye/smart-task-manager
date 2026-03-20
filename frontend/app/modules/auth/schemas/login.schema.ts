import { createApiResponseSchema } from '@/app/lib/api-schema';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .email({ message: 'Email không hợp lệ' }),

    password: z
        .string()
        .min(1, { message: 'Mật khẩu là bắt buộc' }),
})

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const loginSuccessResponseSchema = z.object({
    accessToken: z.
        string(),
    accessTokenExpiresIn: z.
        number(),
    refreshTokenExpiresIn: z.
        number(),
})

export const loginResponseSchema = createApiResponseSchema(loginSuccessResponseSchema);
export type LoginResponse = z.infer<typeof loginResponseSchema>;