'use client';

import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchemaType } from "../schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const useRegister = () => {
    const [loading, setLoading] = useState<boolean>(false);
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

    const onSubmit = form.handleSubmit(async (values) => {
        alert("register");
    })

    return { form, onSubmit, loading }
}