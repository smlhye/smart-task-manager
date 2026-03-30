"use client";

import { CheckCircle2, Clock, ListTodo, Users } from "lucide-react";
import StatsCard from "./StateCard";
import { useCountTaskUser } from "../../tasks/hooks/useCountTaskUser";
import { Button } from "@/app/shared/components/ui";
import { RefreshCw } from "lucide-react";

export default function StatsGrid() {
    const { data, isLoading, error, refetch } = useCountTaskUser();
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-24 rounded-xl bg-[rgb(var(--color-muted))] animate-pulse"
                    />
                ))}
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center">
                <Button onClick={() => {refetch()}} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tải lại
                </Button>
            </div>
        );
    }
    const stats = [
        { label: "Tổng số nhiệm vụ", value: data?.total ?? 0, icon: ListTodo },
        { label: "Chưa làm", value: data?.pending ?? 0, icon: Clock },
        { label: "Đang làm", value: data?.inProgress ?? 0, icon: Clock },
        { label: "Hoàn thành", value: data?.done ?? 0, icon: CheckCircle2 },
        { label: "Quá hạn", value: data?.overdue ?? 0, icon: Clock },
        { label: "Tổng số nhóm", value: data?.groups ?? 0, icon: Users },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {stats.map((item) => (
                <StatsCard key={item.label} item={item} />
            ))}
        </div>
    );
}