'use client';
import { useState, useEffect } from "react";
import TaskBoard from "./ui/TaskBoard";
export type TaskCardProps = {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: Priority;
    deadline?: string;
    assignee?: string;
};
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export default function TaskContainer() {
    const [tasks, setTasks] = useState<TaskCardProps[] | null>(null);

    // Fake fetch
    useEffect(() => {
        setTimeout(() => {
            setTasks([
                { id: 1, title: "Thiết kế UI mới", status: "PENDING", priority: "HIGH", deadline: "2026-03-30" },
                { id: 2, title: "Viết API cho Task", status: "IN_PROGRESS", priority: "MEDIUM" },
                { id: 3, title: "Code module Member", status: "DONE", priority: "LOW" },
                { id: 4, title: "Setup tailwind theme", status: "PENDING", priority: "MEDIUM" },
            ]);
        }, 1000);
    }, []);

    if (!tasks) {
        return (
            <div className="flex gap-4 w-full h-full p-4 overflow-x-auto">
                <TaskColumnSkeleton />
                <TaskColumnSkeleton />
                <TaskColumnSkeleton />
            </div>
        );
    }

    return <TaskBoard tasks={tasks} onTaskClick={(task) => alert(task.title)} />;
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