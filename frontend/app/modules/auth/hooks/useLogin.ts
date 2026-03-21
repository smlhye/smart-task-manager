'use client';

import { useState } from "react";
import { loginSchema, LoginSchemaType } from "../schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useLogin() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const loginMutation = useMutation({
        mutationFn: authService.loginApi,
        onSuccess: (res) => {
            toast.success("Đăng nhập thành công");
            form.reset();
            router.push('/');
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })

    const onSubmit = form.handleSubmit(async (values) => {
        setLoading(loginMutation.isPending);
        loginMutation.mutate(values);
    })

    return {
        form,
        onSubmit,
        loading,
    }
}