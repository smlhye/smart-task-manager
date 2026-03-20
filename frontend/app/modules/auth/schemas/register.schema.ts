import z from "zod";

export const registerSchema = z.object({
    firstName: z
        .string({
            error: "First name is required",
        })
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .transform((val) => val.trim()),
    lastName: z
        .string({
            error: "Last name is required",
        })
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .transform((val) => val.trim()),
    email: z
        .string({
            error: "Email is required",
        })
        .email("Invalid email address")
        .transform((val) => val.toLowerCase().trim()),
    password: z
        .string({
            error: "Password is required",
        })
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must not exceed 32 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Password must include uppercase, lowercase and number"
        ),
    confirmPassword: z.string({
        error: "Confirm password is required",
    }),
    phone: z
        .string()
        .optional()
        .transform((val) => val?.trim())
        .refine((val) => {
            if (!val) return true;
            return /^\+?\d{7,15}$/.test(val);
        }, {
            message: "Invalid phone number",
        }),
    dateOfBirth: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            return !isNaN(Date.parse(val));
        }, {
            message: "Date of birth must be a valid ISO date string",
        }),
})

export type RegisterSchemaType = z.input<typeof registerSchema>;