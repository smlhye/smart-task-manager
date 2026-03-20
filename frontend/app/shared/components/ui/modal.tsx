"use client";

import { cn } from "@/app/lib/cn";

export function Modal({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className={cn(
                    "bg-[rgb(var(--color-card))]",
                    "text-[rgb(var(--color-card-foreground))]",
                    "rounded-lg p-4 shadow-lg w-full max-w-md"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}