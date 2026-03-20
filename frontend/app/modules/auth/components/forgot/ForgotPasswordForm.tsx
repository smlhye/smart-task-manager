"use client";

import { useState } from "react";
import { Input, Button, OtpInput } from "@/app/shared/components/ui";
import { ThemeToggle } from "@/app/shared/components/toggle/theme-toggle";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordContent from "./ForgotPasswordContent";
import { useForgotPassword } from "../../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
    const {
        step,
        loading,
        email,
        setEmail,
        otp,
        setOtp,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        sendOtp,
        verifyOtp,
        resetPassword,
    } = useForgotPassword();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[rgb(var(--color-background))]">
            {/* THEME */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
                {/* LEFT */}
                <div className="hidden md:flex flex-1">
                    <ForgotPasswordContent />
                </div>

                {/* FORM */}
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-md space-y-6 p-6 border border-[rgb(var(--color-border))] rounded-lg shadow-sm bg-[rgb(var(--color-card))]">
                        <h2 className="text-2xl font-semibold text-center">
                            Quên mật khẩu
                        </h2>

                        {/* STEP 1 */}
                        {step === "email" && (
                            <div className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                                <Button
                                    className="w-full"
                                    onClick={sendOtp}
                                    isLoading={loading}
                                >
                                    Gửi OTP
                                </Button>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === "otp" && (
                            <div className="space-y-4">
                                <OtpInput
                                    length={6}
                                    value={otp.join("")}
                                    onChange={(val) => {
                                        // đảm bảo luôn là string[] length 6
                                        const arr = val
                                            .slice(0, 6)
                                            .split("");
                                        setOtp(arr.concat(
                                            Array(6 - arr.length).fill("")
                                        ));
                                    }}
                                />

                                <Button
                                    className="w-full"
                                    onClick={verifyOtp}
                                    isLoading={loading}
                                    disabled={otp.join("").length < 6}
                                >
                                    Xác nhận OTP
                                </Button>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === "reset" && (
                            <div className="space-y-4">
                                {/* PASSWORD */}
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
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(
                                                    e.target.value
                                                )
                                            }
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
                                </div>

                                {/* CONFIRM */}
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
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
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
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={resetPassword}
                                    isLoading={loading}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}