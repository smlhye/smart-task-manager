'use client';

import { useState } from "react";

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
type Props = {
    tasks: TaskCardProps[];
    onTaskClick?: (task: TaskCardProps) => void;
}

export default function TaskBoard({ tasks, onTaskClick }: Props) {

    const columns: { title: string; status: TaskStatus }[] = [
        { title: "Mới", status: 'PENDING' },
        { title: "Đang làm", status: 'IN_PROGRESS' },
        { title: "Hoàn thành", status: 'DONE' },
    ];

    return (
        <div className="flex gap-4 w-full h-full p-4 overflow-x-auto">
            {columns.map((col) => (
                <div key={col.status} className="flex-1 bg-[rgb(var(--color-muted))] rounded-[var(--radius)] p-3 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold uppercase text-[rgb(var(--color-muted-foreground))] mb-2">
                        {col.title}
                    </h3>
                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-hidden">
                        {tasks
                            .filter(t => t.status === col.status)
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="card cursor-pointer hover:shadow-md transition"
                                    onClick={() => onTaskClick?.(task)}
                                >
                                    <h4 className="text-sm font-medium mb-1">{task.title}</h4>
                                    {task.priority && (
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${task.priority === "HIGH"
                                                    ? "bg-red-500"
                                                    : task.priority === "MEDIUM"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                }`}
                                        >
                                            {task.priority.toUpperCase()}
                                        </span>
                                    )}
                                    {task.deadline && (
                                        <p className="text-[11px] text-[rgb(var(--color-muted-foreground))] mt-1">
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}