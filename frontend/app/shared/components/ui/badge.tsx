import { cn } from "@/app/lib/cn";

export type Variant = "default" | "success" | "warning" | "danger";

export function Badge({
    className,
    variant = "default",
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
    const variants: Record<Variant, string> = {
        default:
            "bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))]",
        success: "bg-green-500/90 text-white",
        warning: "bg-yellow-500/90 text-white",
        danger: "bg-red-500/90 text-white",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 text-xs rounded-md font-medium",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}