"use client";

import { useEffect } from "react";
import { cn } from "@/app/lib/cn";

export function Toast({
    message,
    onClose,
}: {
    message: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4",
                "bg-[rgb(var(--color-card))]",
                "text-[rgb(var(--color-card-foreground))]",
                "border border-[rgb(var(--color-border))]",
                "px-4 py-2 rounded-md shadow-md"
            )}
        >
            {message}
        </div>
    );
}