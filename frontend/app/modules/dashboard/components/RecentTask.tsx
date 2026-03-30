"use client";

import { useGetRecentTasks } from "../../tasks/hooks/useGetRecentTasks";
import { RefreshCw } from "lucide-react";
import { Button } from "@/app/shared/components/ui";
import RecentTaskItem from "./RecenTaskItem";

export default function RecentTasks() {
    const { data, isLoading, error, refetch } = useGetRecentTasks();

    if (isLoading) {
        return (
            <div className="lg:col-span-2 p-4 rounded-xl border bg-[rgb(var(--color-card))]">
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-16 rounded-md bg-[rgb(var(--color-muted))] animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lg:col-span-2 p-4 rounded-xl border bg-[rgb(var(--color-card))] flex justify-center">
                <Button onClick={() => { refetch() }} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tải lại
                </Button>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
            <h2 className="text-lg font-medium mb-4">Công việc gần đây</h2>

            <div className="space-y-2">
                {data?.map((task) => (
                    <RecentTaskItem key={task.id} task={task} />
                ))}

                {data?.length === 0 && (
                    <div className="text-sm text-center text-[rgb(var(--color-muted-foreground))] py-6">
                        Không có công việc nào gần đây
                    </div>
                )}
            </div>
        </div>
    );
}