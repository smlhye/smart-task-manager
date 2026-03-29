"use client";

import { useState } from "react";
import { Input, Button, OtpInput } from "@/app/shared/components/ui";
import { ThemeToggle } from "@/app/shared/components/toggle/theme-toggle";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordContent from "./ForgotPasswordContent";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import Link from "next/link";

export default function ForgotPasswordForm() {
    const {
        step,
        loading,
        sendOtpForm,
        verifyOtpForm,
        changePasswordForm,
        onSendOtp,
        onVerifyOtp,
        onChangePassword,
    } = useForgotPassword();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[rgb(var(--color-background))]">
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
                <div className="hidden md:flex flex-1">
                    <ForgotPasswordContent />
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md space-y-6 p-6 border border-[rgb(var(--color-border))] rounded-lg shadow-sm bg-[rgb(var(--color-card))]">
                        <h2 className="text-2xl font-semibold text-center">
                            Quên mật khẩu
                        </h2>
                        {step === "email" && (
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Nhập email"
                                        {...sendOtpForm.register("email")}
                                    />
                                    {sendOtpForm.formState.errors.email && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {sendOtpForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={onSendOtp}
                                    isLoading={loading}
                                >
                                    Gửi OTP
                                </Button>
                            </div>
                        )}
                        {step === "otp" && (
                            <div className="space-y-4">
                                <div>
                                    <OtpInput
                                        length={6}
                                        value={verifyOtpForm.watch("otp") || ""}
                                        onChange={(val) =>
                                            verifyOtpForm.setValue("otp", val, {
                                                shouldValidate: true,
                                            })
                                        }
                                    />
                                    {verifyOtpForm.formState.errors.otp && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {verifyOtpForm.formState.errors.otp.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={onVerifyOtp}
                                    isLoading={loading}
                                >
                                    Xác nhận OTP
                                </Button>
                            </div>
                        )}
                        {step === "reset" && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            {...changePasswordForm.register(
                                                "password"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((p) => !p)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {changePasswordForm.formState.errors.password && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {changePasswordForm.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            {...changePasswordForm.register(
                                                "confirmPassword"
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (p) => !p
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {changePasswordForm.formState.errors.confirmPassword && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {
                                                changePasswordForm.formState.errors.confirmPassword
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={onChangePassword}
                                    isLoading={loading}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        )}
                        <p className="text-xs text-center text-[rgb(var(--color-muted-foreground))]">
                            Bạn đã nhớ tài khoản?{" "}
                            <Link
                                href="/login"
                                className="underline cursor-pointer"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}