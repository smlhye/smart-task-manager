'use client';

import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchemaType } from "../schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useRegister = () => {
    const [loading, setLoading] = useState<boolean>(false);
     const router = useRouter();
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: (res) => {
            toast.success("Đăng ký tài khoản thành công");
            form.reset();
            router.push('/login');
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })

    const onSubmit = form.handleSubmit(async (values) => {
        const { confirmPassword, ...payload } = values;
        registerMutation.mutate(payload);
    })

    return { form, onSubmit, loading: registerMutation.isPending }
}