"use client";

import { UseFormReturn } from "react-hook-form";
import { RegisterSchemaType } from "../../schemas/register.schema";
import { ThemeToggle } from "@/app/shared/components/toggle/theme-toggle";
import { Button, Input } from "@/app/shared/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import RegisterContent from "./RegisterContent";

type Props = {
    form: UseFormReturn<RegisterSchemaType>;
    onSubmit: () => void;
    loading: boolean;
};

export default function RegisterForm({ form, onSubmit, loading }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[rgb(var(--color-background))]">

            {/* THEME TOGGLE */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* CONTAINER */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">

                {/* LEFT CONTENT */}
                <div className="hidden md:flex flex-1">
                    <RegisterContent />
                </div>

                {/* FORM */}
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md space-y-6 p-6 border border-[rgb(var(--color-border))] rounded-lg shadow-sm bg-[rgb(var(--color-card))]">

                        <h2 className="text-2xl font-semibold">Tạo tài khoản</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* NAME */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-sm">Họ</label>
                                    <Input
                                        placeholder="Họ"
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-red-500">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm">Tên</label>
                                    <Input
                                        placeholder="Tên"
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-red-500">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* EMAIL */}
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

                            {/* PASSWORD */}
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
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

                            <div className="space-y-1">
                                <label className="text-sm">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* PHONE + DOB */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-sm">Số điện thoại</label>
                                    <Input
                                        placeholder="Số điện thoại"
                                        {...register("phone")}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm">Ngày sinh</label>
                                    <Input type="date" {...register("dateOfBirth")} />
                                    {errors.dateOfBirth && (
                                        <p className="text-xs text-red-500">
                                            {errors.dateOfBirth.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* BUTTON */}
                            <Button type="submit" className="w-full" isLoading={loading}>
                                Đăng ký
                            </Button>
                        </form>

                        {/* FOOTER */}
                        <p className="text-xs text-center text-[rgb(var(--color-muted-foreground))]">
                            Đã có tài khoản?{" "}
                            <span className="underline cursor-pointer">
                                Đăng nhập
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}