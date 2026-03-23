import { createApiResponseSchema } from "@/app/lib/api-schema";
import z from "zod";

export const groupSchema = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    role: z.string(),
})

const groupsArraySchema = z.array(groupSchema);
export const groupsResponseSchema = createApiResponseSchema(groupsArraySchema);
export type GroupSchemaType = z.infer<typeof groupSchema>;

export const filterGroupSchema = z.object({
    name: z.string().optional(),
    take: z.number().min(1).optional(),
    cursor: z.string().optional(),
})

export type FilterGroup = z.infer<typeof filterGroupSchema>;

export const groupCreateSchema = z.object({
    name: z.string()
        .min(1, { message: 'Tên nhóm phải có ít nhất 1 ký tự' })
})

export type GroupCreateType = z.input<typeof groupCreateSchema>;

export const groupUpdateSchema = z.object({
    id: z.number(),
    name: z.string()
        .min(1, { message: 'Tên nhóm phải có ít nhất 1 ký tự' })
})
export type GroupUpdateType = z.input<typeof groupUpdateSchema>;

export const groupCreatedSchema = z.object({
    id: z.number(),
    name: z.string(),
    userId: z.number(),
    role: z.string(),
    createdAt: z.string(),
})