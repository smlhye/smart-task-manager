"use client";

import { useState } from "react";

type Step = "email" | "otp" | "reset";

export const useForgotPassword = () => {
    const [step, setStep] = useState<Step>("email");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const sendOtp = async () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setStep("otp");
        }, 1000);
    };

    const verifyOtp = async () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setStep("reset");
        }, 1000);
    };

    const resetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            alert("Đổi mật khẩu thành công!");
        }, 1000);
    };

    return {
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
    };
};