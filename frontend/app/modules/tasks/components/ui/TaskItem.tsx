'use client';

import { Badge, Button, Variant } from "@/app/shared/components/ui";
import { cn } from "@/app/lib/cn";
import MultiAvatar from "@/app/shared/components/avatar/multi-avatar";
import { CreatedTaskType, TaskPriorityType } from "../../schemas/task.schema";
import { useTaskStore } from "../../stores/task.store";
import { useRouter } from "next/navigation";
import { getTaskById } from "../../hooks/useGetTaskById";
import { Clock, RefreshCw, Users } from "lucide-react";

type Props = {
    task: CreatedTaskType;
    index: number;
    groupId?: number
    onClose?: () => void;
};

const PRIORITY_CLASSES: Record<TaskPriorityType, Variant> = {
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "default",
};

export default function TaskItem({ task, index, groupId }: Props) {
    const router = useRouter();
    const reset = useTaskStore((s) => s.reset);
    const setMethod = useTaskStore((s) => s.setMethod);
    const setGroupId = useTaskStore((s) => s.setGroupId);
    const setTask = useTaskStore((s) => s.setTask);
    const finalGroupId = task.groupId ?? groupId;
    const { data, loading, error, refetch } = getTaskById({ groupId: finalGroupId, taskId: task.id });
    const isOverdue = task.status !== "DONE" && 
        task.deadline && new Date(task.deadline) < new Date();

    if (loading) return <div key={index} className="h-16 bg-[rgb(var(--color-secondary))] rounded-[var(--radius)] skeleton" />
    if (error) return <Button onClick={() => { refetch() }}><RefreshCw /></Button>

    const handleUpdate = () => {
        reset();
        setMethod("UPDATE");
        setGroupId(finalGroupId);
        if (task) setTask(task);
        let url = `${finalGroupId}/tasks/${task.id}`;
        if (!groupId) {
            url = 'groups/' + url;
        }
        router.push(url);
    }
    return (
        <>
            <div
                key={task.id}
                onClick={handleUpdate}
                className={cn(
                    "group p-3 rounded-xl cursor-pointer flex flex-col gap-3",
                    "bg-[rgb(var(--color-card))] border border-[rgb(var(--color-background))]",
                    "hover:shadow-md transition-all duration-200 animate-fade-in"
                )}
                style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "both",
                }}
            >
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-semibold leading-tight group-hover:text-primary transition">
                        {task.title}
                    </h4>

                    {task.priority && (
                        <Badge
                            className="rounded-full px-2 py-0.5 text-[10px]"
                            variant={PRIORITY_CLASSES[task.priority]}
                        >
                            {task.priority}
                        </Badge>
                    )}
                </div>
                {task.description && (
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))] line-clamp-2">
                        {task.description}
                    </p>
                )}
                <div className="flex flex-col gap-1 text-xs text-[rgb(var(--color-muted-foreground))]">
                    <div className="flex flex-col gap-2 text-xs">
                        {task.deadline && (
                            <div className="flex items-center gap-2">
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

                                <span
                                    className={cn(
                                        "font-medium",
                                        isOverdue
                                            ? "text-red-500"
                                            : "text-foreground"
                                    )}
                                >
                                    {new Date(task.deadline).toLocaleString()}
                                </span>

                                {isOverdue && (
                                    <span className="text-[10px] font-semibold text-red-500 bg-red-100 px-1.5 py-0.5 rounded">
                                        Quá hạn
                                    </span>
                                )}
                            </div>
                        )}

                        {task.name && (
                            <div className="flex items-center gap-2 text-[rgb(var(--color-muted-foreground))]">
                                <div className="p-1 rounded-md bg-blue-100 text-blue-500">
                                    <Users className="w-3.5 h-3.5" />
                                </div>

                                <span className="font-medium text-foreground">
                                    {task.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {task.assignees && (
                    <div className="pt-3 border-t border-[rgb(var(--color-border))]">
                        <MultiAvatar names={task.assignees.map(item => item.name)} />
                    </div>
                )}
            </div>
        </>
    );
}