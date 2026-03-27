'use client';

import { Badge, Variant } from "@/app/shared/components/ui";
import { cn } from "@/app/lib/cn";
import MultiAvatar from "@/app/shared/components/avatar/multi-avatar";
import { CreatedTaskType, TaskPriorityType } from "../../schemas/task.schema";
import { useTaskStore } from "../../stores/task.store";
import { useRouter } from "next/navigation";
import { getTaskById } from "../../hooks/useGetTaskById";

type Props = {
    task: CreatedTaskType;
    index: number;
    groupId: number
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
    const { data, loading, error, refetch } = getTaskById({ groupId, taskId: task.id });

    if(loading) return <>Loading</>
    if(error) return <>Có lỗi</>

    const handleUpdate = () => {
        reset(),
        setMethod("UPDATE");
        setGroupId(groupId);
        if(data) setTask(data);
        router.push(`${groupId}/tasks/${task.id}`);
    }
    return (
        <>
            <div
                key={task.id}
                className={cn(
                    "p-3 bg-[rgb(var(--color-card))] rounded-md cursor-pointer flex flex-col gap-2 hover:shadow-md transition-all animate-fade-in duration-200"
                )}
                onClick={handleUpdate}
                style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "both",
                }}
            >
                <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold">{task.title}</h4>
                    {task.priority && (
                        <Badge
                            variant={PRIORITY_CLASSES[task.priority]}
                        >
                            {task.priority}
                        </Badge>
                    )}
                </div>

                {task.description && (
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Mô tả: <span className="italic">{task.description}</span>
                    </p>
                )}

                {task.deadline && (
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Hạn chót: <span className="font-bold">{new Date(task.deadline).toLocaleDateString()}</span>
                    </p>
                )}

                {task.assignees && (
                    <MultiAvatar names={task.assignees.map(item => item.name)} />
                )}
            </div>
        </>
    );
}