'use client';

import { cn } from "@/app/lib/cn";
import { Button } from "@/app/shared/components/ui";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaskMethod, useTaskStore } from "../../stores/task.store";
import TaskForm from "./TaskForm";

const titles: Record<TaskMethod, string> = {
    CREATE: "Thêm nhiệm vụ mới",
    UPDATE: "Chỉnh sửa nhiệm vụ",
    VIEW: "Xem nhiệm vụ",
};

export default function TaskDetailsPage() {
    const router = useRouter();
    const method = useTaskStore((s) => s.method);
    const reset = useTaskStore((s) => s.reset);
    const groupId = useTaskStore((s) => s.groupId);

    return (
        <div className="p-3 flex flex-col gap-3 h-full overflow-hidden">
            <div className="bg-[rgb(var(--color-card))] shadow-sm rounded-md flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-[rgb(var(--color-muted))]"
                        onClick={() => {
                            router.back();
                            reset();
                        }}
                    >
                        <ChevronLeft className="w-4 h-4 text-[rgb(var(--color-muted-foreground))]" />
                    </Button>

                    <h2 className="text-base font-semibold text-[rgb(var(--color-foreground))]">
                        {titles[method ?? "VIEW"]}
                    </h2>
                </div>
            </div>

            {groupId && (
                <div className="bg-[rgb(var(--color-card))] flex-1 min-h-0 grid grid-cols-2 gap-4 p-3 rounded-md animate-fade-in">
                    <div className="min-h-0">
                        <TaskForm groupId={groupId} />
                    </div>

                    <div className="bg-[rgb(var(--color-muted))] rounded-md" />
                </div>
            )}
        </div>
    );
}