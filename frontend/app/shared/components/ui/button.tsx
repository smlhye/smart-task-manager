"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const base =
            "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-ring))]";

        const variants: Record<Variant, string> = {
            primary:
                "bg-[rgb(var(--color-primary))] text-white hover:opacity-90",
            secondary:
                "bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))]",
            outline:
                "border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-secondary))]",
            ghost:
                "hover:bg-[rgb(var(--color-muted))]",
            danger:
                "bg-[rgb(var(--color-destructive))] text-[rgb(var(--color-destructive-foreground))] hover:opacity-90",
        };

        const sizes: Record<Size, string> = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-5 py-3 text-base",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    base,
                    variants[variant],
                    sizes[size],
                    (disabled || isLoading) && "opacity-50 cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";