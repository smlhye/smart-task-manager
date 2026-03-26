import z, { email } from "zod";

export const userResponseSchema = z.object({
    id: z.number(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    dateOfBirth: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    avatarUrl: z.string(),
})

export type UserResponseType = z.infer<typeof userResponseSchema>;

export const memberSearchResultSchema = z.object({
    id: z.number(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
})
export type MemberSearchResultType = z.infer<typeof memberSearchResultSchema>

export const memberSearchListResultSchema = z.array(memberSearchResultSchema);
export type MemberSearchListResultType = z.infer<typeof memberSearchListResultSchema>

export const memberSearchResponseSchema = z.object({
    members: memberSearchListResultSchema,
    nextCursor: z.string().nullable(),
})

export type MemberSearchResponseType = z.infer<typeof memberSearchResponseSchema>;

export const filterMemberSearchSchema = z.object({
    name: z.string().optional(),
    take: z.number().min(1).optional(),
    cursor: z.string().optional(),
})

export type FilterMemberSearchType = z.infer<typeof filterMemberSearchSchema>;