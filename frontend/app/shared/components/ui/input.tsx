"use client";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/app/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full rounded-md border border-[rgb(var(--color-input))] bg-transparent px-3 py-2 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-ring))]",
                    "transition",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";