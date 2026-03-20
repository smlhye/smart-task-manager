"use client";

import { useRegister } from "../../hooks/useRegister";
import RegisterForm from "./RegisterForm";

export default function RegisterContainer() {
    const { form, onSubmit, loading } = useRegister();

    return (
        <RegisterForm
            form={form}
            onSubmit={onSubmit}
            loading={loading}
        />
    );
}