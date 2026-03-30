'use client';

import { cn } from "@/app/lib/cn"
import { useUserStore } from "../../users/stores/user.store";
import { useTasksPending } from "../hooks/useTasksPending";
import { useTasksInProgress } from "../hooks/useTaskInProgress";
import { useTasksDone } from "../hooks/useTasksDone";
import TaskBoard from "./ui/TaskBoard";
import { ListTodoIcon } from "lucide-react";
import { useState } from "react";

type FilterTaskType = "ALL" | "ACTIVE" | "OVERDUE";

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
};

export default function MyTaskContainer() {
    const { user } = useUserStore();
    const [filterPending, setFilterPending] = useState<FilterTaskType>('ALL');
    const [filterInProgress, setFilterInProgress] = useState<FilterTaskType>('ALL');
    const { tasks: pendingTasks, loadMore: pendingLoadMore, hasMore: pendingHasMore, loadingMore: pendingLoadingMore } = useTasksPending({
        filter: filterPending,
        take: 20,
    });
    const { tasks: inProgressTasks, loadMore: inProgressLoadMore, hasMore: inProgressHasMore, loadingMore: inProgressLoadingMore } = useTasksInProgress({
        filter: filterInProgress,
        take: 20,
    });
    const { tasks: doneTasks, loadMore: doneLoadMore, hasMore: doneHasMore, loadingMore: doneLoadingMore } = useTasksDone({
        take: 20,
    });
    const avatarColor = stringToColor(user?.firstName || "");

    if (!pendingTasks || !inProgressTasks || !doneTasks) {
        return (
            <div className="flex gap-4 w-full h-full p-4 overflow-x-auto">
                <TaskColumnSkeleton />
                <TaskColumnSkeleton />
                <TaskColumnSkeleton />
            </div>
        );
    }

    return (
        <div className={cn(
            "flex flex-col h-full w-full bg-[rgb(var(--color-muted))]"
        )}>
            <div className="flex items-center justify-between px-3 bg-[rgb(var(--color-background))] py-2 border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold text-white bg-[rgb(var(--color-primary))]"
                        style={{
                            background: avatarColor,
                        }}>
                        <ListTodoIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-sm font-semibold">
                            Nhiệm vụ của tôi
                        </h2>
                        <p className="text-xs text-[rgb(var(--color-muted-foreground))] opacity-80">
                            Danh sách nhiệm vụ hiện tại của bạn
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full h-full p-3 items-stretch overflow-x-auto">
                <TaskBoard filterValue={filterPending} onFilterChange={(filter) => setFilterPending(filter as FilterTaskType)} loadMore={pendingLoadMore} hasMore={pendingHasMore} loadingMore={pendingLoadingMore} status={'PENDING'} tasks={pendingTasks} />
                <TaskBoard filterValue={filterInProgress} onFilterChange={(filter) => setFilterInProgress(filter as FilterTaskType)} loadMore={inProgressLoadMore} hasMore={inProgressHasMore} loadingMore={inProgressLoadingMore} status={'IN_PROGRESS'} tasks={inProgressTasks} />
                <TaskBoard loadMore={doneLoadMore} hasMore={doneHasMore} loadingMore={doneLoadingMore} status={'DONE'} tasks={doneTasks} />
            </div>
        </div>
    )
}

export function TaskColumnSkeleton() {
    return (
        <div className="flex-1 bg-[rgb(var(--color-muted))] rounded-[var(--radius)] p-3 flex flex-col gap-2 animate-fade-in">
            <div className="h-4 w-16 bg-[rgb(var(--color-border))] rounded-full mb-2" />
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-[rgb(var(--color-secondary))] rounded-[var(--radius)] skeleton" />
            ))}
        </div>
    )
}