import { cn } from "@/app/lib/cn";

const colorMap: Record<string, string> = {
    "Tổng số nhiệm vụ": "bg-blue-100 text-blue-600",
    "Chưa làm": "bg-yellow-100 text-yellow-600",
    "Đang làm": "bg-orange-100 text-orange-600",
    "Hoàn thành": "bg-green-100 text-green-600",
    "Quá hạn": "bg-red-100 text-red-600",
    "Tổng số nhóm": "bg-purple-100 text-purple-600",
};

export default function StatsCard({ item }: any) {
    const Icon = item.icon;
    const isOverdue = item.label === "Quá hạn" && item.value > 0;

    return (
        <div
            className={cn(
                "group relative p-4 rounded-xl border bg-[rgb(var(--color-card))]",
                "border-[rgb(var(--color-border))] shadow-sm",
                "hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden",
                isOverdue && "ring-1 ring-red-300 bg-red-50/40"
            )}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[rgb(var(--color-muted-foreground))]">
                    {item.label}
                </span>

                <div className={cn("p-2 rounded-lg", colorMap[item.label])}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div
                className={cn(
                    "mt-3 text-2xl font-semibold tracking-tight transition",
                    isOverdue && "text-red-600"
                )}
            >
                {item.value}
            </div>
        </div>
    );
}