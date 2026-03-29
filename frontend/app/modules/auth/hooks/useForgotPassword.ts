"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    changePasswordSchema,
    ChangePasswordType,
    sendOtpSchema,
    SendOtpType,
    verifyOtpSchema,
    VerifyOtpType,
} from "../schemas/forgot.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "reset";

export const useForgotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");

    // 👉 Forms
    const sendOtpForm = useForm<SendOtpType>({
        resolver: zodResolver(sendOtpSchema),
        defaultValues: { email: "" },
    });

    const verifyOtpForm = useForm<VerifyOtpType>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: { email: "", otp: "" },
    });

    const changePasswordForm = useForm<ChangePasswordType>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    // 👉 Mutations
    const sendOtpMutation = useMutation({
        mutationFn: authService.sendOtpApi,
        onSuccess: (_, variables) => {
            verifyOtpForm.setValue("email", variables.email);
            changePasswordForm.setValue("email", variables.email);
            setStep("otp");
        },
        onError: (err: any) => toast.error(err.message),
    });

    const verifyOtpMutation = useMutation({
        mutationFn: authService.verifyOtpApi,
        onSuccess: () => setStep("reset"),
        onError: (err: any) => toast.error(err.message),
    });

    const changePasswordMutation = useMutation({
        mutationFn: authService.changePasswordApi,
        onSuccess: () => {
            toast.success("Đổi mật khẩu thành công!");
            router.push("/login");
        },
        onError: (err: any) => toast.error(err.message),
    });

    // 👉 Handlers
    const onSendOtp = sendOtpForm.handleSubmit((data) => {
        sendOtpMutation.mutate(data);
    });

    const onVerifyOtp = verifyOtpForm.handleSubmit((data) => {
        verifyOtpMutation.mutate(data);
    });

    const onChangePassword = changePasswordForm.handleSubmit((data) => {
        const { confirmPassword, ...payload } = data;
        changePasswordMutation.mutate(payload);
    });

    const loading =
        sendOtpMutation.isPending ||
        verifyOtpMutation.isPending ||
        changePasswordMutation.isPending;

    return {
        step,
        loading,

        sendOtpForm,
        verifyOtpForm,
        changePasswordForm,

        onSendOtp,
        onVerifyOtp,
        onChangePassword,
    };
};