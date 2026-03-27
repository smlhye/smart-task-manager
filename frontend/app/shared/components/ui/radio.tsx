"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/app/lib/cn";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    ref={ref}
                    type="radio"
                    className={cn(
                        "w-4 h-4",
                        "accent-[rgb(var(--color-primary))]",
                        "cursor-pointer",
                        className
                    )}
                    {...props}
                />
                {label && (
                    <span className="text-sm text-[rgb(var(--color-foreground))]">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Radio.displayName = "Radio";