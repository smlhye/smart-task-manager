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
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
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