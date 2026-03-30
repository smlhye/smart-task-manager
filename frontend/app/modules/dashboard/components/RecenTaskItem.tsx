"use client";

import { Clock } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { useTimeAgo } from "@/app/shared/hooks/useTimeAgo";
import { TaskRecentType } from "../../tasks/schemas/task.schema";

export default function RecentTaskItem({ task }: { task: TaskRecentType }) {
    const timeAgo = useTimeAgo(
        task.updatedAt ? new Date(task.updatedAt) : undefined
    );

    const isOverdue =
        task.status !== "DONE" &&
        new Date(task.deadline) < new Date();

    return (
        <div
            className={cn(
                "group flex items-center justify-between p-3 rounded-lg transition cursor-pointer",
                "hover:bg-[rgb(var(--color-muted)/0.5)]",
                isOverdue && "bg-red-50/40"
            )}
        >
            <div className="min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary">
                    {task.title}
                </p>

                <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-muted-foreground))]">
                    <div
                        className={cn(
                            "p-1 rounded-md",
                            isOverdue
                                ? "bg-red-100 text-red-500"
                                : "bg-orange-100 text-orange-500"
                        )}
                    >
                        <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span title={new Date(task.updatedAt).toLocaleString()}>
                        {timeAgo}
                    </span>
                    <span className="truncate">• {task.name}</span>
                </div>
            </div>
            <span
                className={cn(
                    "text-[10px] px-2 py-1 rounded font-medium shrink-0",
                    task.status === "DONE" &&
                    "bg-green-100 text-green-600",
                    task.status === "IN_PROGRESS" &&
                    "bg-blue-100 text-blue-600",
                    task.status === "PENDING" &&
                    "bg-yellow-100 text-yellow-600"
                )}
            >
                {task.status === "DONE"
                    ? "Hoàn thành"
                    : task.status === "IN_PROGRESS"
                        ? "Đang làm"
                        : "Chưa làm"}
            </span>
        </div>
    );
}