import { cn } from "@/app/lib/cn";

export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-card-foreground))] p-4 shadow-sm",
                className
            )}
            {...props}
        />
    );
}