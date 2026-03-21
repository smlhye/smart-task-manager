"use client";

import { UseFormReturn } from "react-hook-form";
import { LoginSchemaType } from "../../schemas/login.schema";
import { ThemeToggle } from "@/app/shared/components/toggle/theme-toggle";
import { Button, Input } from "@/app/shared/components/ui";
import LoginContent from "./LoginContent";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type Props = {
    form: UseFormReturn<LoginSchemaType>;
    onSubmit: () => void;
    loading: boolean;
};

export default function LoginForm({ form, onSubmit, loading }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[rgb(var(--color-background))]">

            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">

                <div className="hidden md:flex flex-1">
                    <LoginContent />
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md space-y-6 p-6 border border-[rgb(var(--color-border))] rounded-lg shadow-sm bg-[rgb(var(--color-card))]">

                        <h2 className="text-2xl font-semibold text-center">Đăng nhập</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            <div className="space-y-1">
                                <label className="text-sm">Email</label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Mật khẩu</label>

                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("password")}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted-foreground))]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-xs text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" isLoading={loading}>
                                Đăng nhập
                            </Button>
                        </form>

                        <div className="flex justify-between text-xs text-[rgb(var(--color-muted-foreground))]">
                            <span>
                                Chưa có tài khoản?{" "}
                                <Link href="/register" className="underline cursor-pointer">
                                    Đăng ký
                                </Link>
                            </span>

                            <Link href="/forgot-password" className="underline">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}