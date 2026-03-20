import { cn } from "@/app/lib/cn";

export function Avatar({
    src,
    alt,
    className,
}: {
    src?: string;
    alt?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center",
                className
            )}
        >
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm text-gray-500">?</span>
            )}
        </div>
    );
}