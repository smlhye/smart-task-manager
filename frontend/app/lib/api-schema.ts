import { z } from 'zod';

export const errorSchema = z.object({
    code: z.string(),
    message: z.string(),
});

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema?: T) =>
    z.object({
        statusCode: z.number(),
        success: z.boolean(),
        error: errorSchema.nullable(),
        data: dataSchema ? dataSchema.nullable() : z.null(),
    });

export type ApiResponse<T> = {
    statusCode: number,
    success: boolean,
    error: {
        code: string,
        message: string,
    } | null;
    data: T | null;
}