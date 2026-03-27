'use client';

import { useForm } from "react-hook-form"
import { createTaskSchema, CreateTaskType } from "../schemas/task.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskService } from "../services/task.service"
import { toast } from "sonner"
import { useTaskStore } from "../stores/task.store"
import { useRouter } from "next/navigation"

export const useCreateTask = (groupId: number) => {
    const queryClient = useQueryClient();

    const reset = useTaskStore((s) => s.reset);
    const router = useRouter();
    const form = useForm<CreateTaskType>({
        resolver: zodResolver(createTaskSchema),
    })

    const createMutate = useMutation({
        mutationFn: ({ groupId, values }: { groupId: number, values: CreateTaskType }) => taskService.createTask(groupId, values),
        onSuccess: (res) => {
            toast.success("Thêm thành công nhiệm vụ mới");
            reset();
            queryClient.invalidateQueries({
                queryKey: ['tasks-pending', undefined, groupId],
                exact: true,
            });
            router.back();
        },
        onError: (err) => {
            toast.error(err.message);
        }
    })

    const onSubmit = form.handleSubmit((values: CreateTaskType) => {
        createMutate.mutate({ groupId, values });
    })

    return {
        form,
        onSubmit,
        loading: createMutate.isPending,
    }
}