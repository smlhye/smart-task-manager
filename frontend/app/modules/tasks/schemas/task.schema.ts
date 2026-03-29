import z from "zod";

export const taskStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "DONE"], {
    message: "Trạng thái là bắt buộc",
});
export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"], {
    message: "Mức độ ưu tiên là bắt buộc",
});

export type TaskStatusType = z.infer<typeof taskStatusSchema>;
export type TaskPriorityType = z.infer<typeof taskPrioritySchema>;

export const createTaskSchema = z.object({
    title: z
        .string({ message: "Vui lòng nhập tiêu đề" })
        .min(2, { message: "Tiêu đề phải có ít nhất 2 ký tự" })
        .max(255, { message: "Tiêu đề không được vượt quá 255 ký tự" }),
    description: z
        .string()
        .transform((val) => (val.trim() === "" ? null : val))
        .optional()
        .nullable()
        .refine((val) => val === null || val === undefined || val === "" || val.length >= 2, {
            message: "Mô tả phải có ít nhất 2 ký tự",
        }),
    priority: taskPrioritySchema,
    deadline: z
        .string({ message: "Vui lòng chọn deadline" })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Hạn nộp không hợp lệ",
        }),
    assignees: z.array(z.number()).default([]),
})

export type CreateTaskType = z.input<typeof createTaskSchema>;


export const memberAssignedSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const createdTaskSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    deadline: z.string(),
    assignees: z.array(memberAssignedSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const taskListSchema = z.array(createdTaskSchema).default([]);

export type CreatedTaskType = z.input<typeof createdTaskSchema>;

export const filterTaskSchema = z.object({
    take: z.number().min(1).optional(),
    cursor: z.string().optional(),
})

export type FilterTaskType = z.infer<typeof filterTaskSchema>;

export const taskFormSchema = createTaskSchema.extend({
    status: taskStatusSchema.optional(),
});

export type TaskFormType = z.input<typeof taskFormSchema>;

export const countTaskSchema = z.object({
    total: z.number(),
    inProgress: z.number(),
    done: z.number(),
    overdue: z.number(),
})

export type CountTaskType = z.infer<typeof countTaskSchema>;