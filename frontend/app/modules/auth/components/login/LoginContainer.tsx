"use client";

import { useLogin } from "../../hooks/useLogin";
import LoginForm from "./LoginForm";

export default function LoginContainer() {
    const { form, onSubmit, loading } = useLogin();
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[rgb(var(--color-background))]">
            <LoginForm form={form} onSubmit={onSubmit} loading={loading} />
        </div>
    );
}