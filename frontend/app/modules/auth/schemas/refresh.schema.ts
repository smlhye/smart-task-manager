import { createApiResponseSchema } from "@/app/lib/api-schema";
import { z } from "zod";

export const refreshSchema = createApiResponseSchema(
    z.object({
        accessToken: z.string(),
        accessTokenExpiresIn: z.number(),
        refreshTokenExpiresIn: z.number(),
    })
)