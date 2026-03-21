import z from "zod";

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