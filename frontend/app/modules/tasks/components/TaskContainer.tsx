'use client';
import TaskBoard from "./ui/TaskBoard";
import { useTasksPending } from "../../group/hooks/useTasksPending";
import { useTasksInProgress } from "../../group/hooks/useTasksInProgress";
import { useTasksDone } from "../../group/hooks/useTasksDone";
import { useRouter } from "next/navigation";
import { useTaskStore } from "../stores/task.store";

type Props = {
    groupId: number;
}

export default function TaskContainer({ groupId }: Props) {
    const router = useRouter();
    const setMethod = useTaskStore((s) => s.setMethod);
    const reset = useTaskStore((s) => s.reset);
    const setGroupId = useTaskStore((s) => s.setGroupId);
    const { tasks: pendingTasks, loadMore: pendingLoadMore, hasMore: pendingHasMore, loadingMore: pendingLoadingMore } = useTasksPending(groupId, {
        take: 20,
    });
    const { tasks: inProgressTasks, loadMore: inProgressLoadMore, hasMore: inProgressHasMore, loadingMore: inProgressLoadingMore } = useTasksInProgress(groupId, {
        take: 20,
    });
    const { tasks: doneTasks, loadMore: doneLoadMore, hasMore: doneHasMore, loadingMore: doneLoadingMore } = useTasksDone(groupId, {
        take: 20,
    });

    const handleCreateClick = () => {
        reset();
        setMethod('CREATE');
        setGroupId(groupId);
        router.push(`${groupId}/tasks`);
    }
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
        <div className="flex gap-3 w-full h-full p-3 items-stretch overflow-x-auto">
            <TaskBoard groupId={groupId} onCreateTask={handleCreateClick} loadMore={pendingLoadMore} hasMore={pendingHasMore} loadingMore={pendingLoadingMore} status={'PENDING'} tasks={pendingTasks} onTaskClick={() => { }} />
            <TaskBoard groupId={groupId} loadMore={inProgressLoadMore} hasMore={inProgressHasMore} loadingMore={inProgressLoadingMore} status={'IN_PROGRESS'} tasks={inProgressTasks} onTaskClick={() => { }} />
            <TaskBoard groupId={groupId} loadMore={doneLoadMore} hasMore={doneHasMore} loadingMore={doneLoadingMore} status={'DONE'} tasks={doneTasks} onTaskClick={() => { }} />
        </div>
    );
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