'use client';

import { useEffect, useState } from "react";
import { useAuthStore } from "./stores/auth.store";
import { authService } from "./modules/auth/services/auth.service";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
    const setToken = useAuthStore((s) => s.setAccessToken);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await authService.refreshApi();
                setToken(data.accessToken);
            } catch {
                useAuthStore.getState().clear();
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [setToken]);

    if (loading) return null;

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}