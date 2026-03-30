import { createApiResponseSchema } from "@/app/lib/api-schema";
import z, { email } from "zod";

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

export const groupDetailsSchema = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type GroupDetailsType = z.infer<typeof groupDetailsSchema>;

export const searchMemberByEmailSchema = z.object({
    groupId: z.number(),
    email: z
        .email("Email không hợp lệ")
        .transform((val) => val.toLowerCase().trim()),
})

export type SearchMemberByEmailType = z.input<typeof searchMemberByEmailSchema>;

export const searchMemberByEmailResultSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    isMember: z.boolean(),
})

export type SearchMemberByEmailResultType = z.infer<typeof searchMemberByEmailResultSchema>;

export const inviteNotificationSchema = z.object({
    receiverId: z.number(),
    groupId: z.number(),
})

export type InviteNotificationType = z.infer<typeof inviteNotificationSchema>

export const changeRoleSchema = z.object({
    userId: z
        .number({ message: "userId is required" }),
    role: z.string(),
});

export type ChangeRoleType = z.infer<typeof changeRoleSchema>;


export const rolesSchema = z.object({
    roles: z.array(z.string()),
});

export type RolesType = z.infer<typeof rolesSchema>;