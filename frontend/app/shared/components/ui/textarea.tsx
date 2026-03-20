import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/app/lib/cn";

export const Textarea = forwardRef<
    HTMLTextAreaElement,
    TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "w-full min-h-[80px] rounded-md border border-[rgb(var(--color-input))]",
                "bg-transparent px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-ring))]",
                "resize-none transition",
                className
            )}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";