'use client';

import { useForm } from "react-hook-form"
import { CreatedTaskType, createTaskSchema, CreateTaskType, taskFormSchema, TaskFormType } from "../schemas/task.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { taskService } from "../services/task.service"
import { toast } from "sonner"
import { useTaskStore } from "../stores/task.store"
import { useRouter } from "next/navigation"
import { useEffect } from "react";

type Props = {
    mode: "CREATE" | "UPDATE",
    groupId: number,
    data?: CreatedTaskType | null;
}

export const useTaskForm = ({ mode, groupId, data }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const resetStore = useTaskStore((s) => s.reset);

    const form = useForm<TaskFormType>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "LOW",
            deadline: "",
            assignees: [],
        },
    });

    const formatDateTimeLocal = (date: string) => {
        const d = new Date(date);
        const pad = (n: number) => n.toString().padStart(2, "0");

        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    useEffect(() => {
        if (mode === "UPDATE" && data) {
            form.reset({
                title: data.title,
                description: data.description ?? "",
                priority: data.priority,
                status: data.status,
                deadline: formatDateTimeLocal(data.deadline),
                assignees: data.assignees?.map((a) => a.id) ?? [],
            });
        }
    }, [data, mode, form]);


    const createMutation = useMutation({
        mutationFn: (values: CreateTaskType) =>
            taskService.createTask(groupId, values),
        onSuccess: () => {
            toast.success("Thêm thành công nhiệm vụ mới");
            resetStore();
            queryClient.invalidateQueries({
                queryKey: ["tasks-pending"],
                refetchType: "active",
            });
            router.back();
        },
        onError: (err: any) => toast.error(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: (values: TaskFormType) =>
            taskService.updateTask(groupId, data!.id, values),
        onSuccess: () => {
            toast.success("Cập nhật nhiệm vụ thành công");
            resetStore();
            queryClient.invalidateQueries({
                queryKey: ["tasks-pending"],
                refetchType: "active",                
            });
            queryClient.invalidateQueries({
                queryKey: ["tasks-in-progress"],
                refetchType: "active",
            });
            queryClient.invalidateQueries({
                queryKey: ["tasks-done"],
                refetchType: "active",
            });
            router.back();
        },
        onError: (err: any) => toast.error(err.message),
    });

    const onSubmit = form.handleSubmit((values) => {
        if (mode === "CREATE") {
            const { status, ...payload } = values;
            createMutation.mutate(payload);
        } else {
            console.log(values);
            updateMutation.mutate(values);
        }
    });

    return {
        form,
        onSubmit,
        loading: createMutation.isPending || updateMutation.isPending,
    };
}