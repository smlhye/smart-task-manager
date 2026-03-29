'use client';

import { Button, Input, Radio, Textarea } from "@/app/shared/components/ui";
import { InfoIcon, Save } from "lucide-react";
import { Controller } from "react-hook-form";
import SearchMember from "./search-member/SearchMember";
import { useRef, useState } from "react";
import { cn } from "@/app/lib/cn";
import { useTaskStore } from "../../stores/task.store";
import { useTaskForm } from "../../hooks/useTaskForm";
import { useMember } from "@/app/modules/group/hooks/useMember";

type Props = {
    groupId: number;
};

export default function TaskForm({ groupId }: Props) {
    const method = useTaskStore((s) => s.method);
    const task = useTaskStore((s) => s.task);
    const { data } = useMember({ groupId });

    const { form, onSubmit, loading } = useTaskForm({
        mode: method as "CREATE" | "UPDATE",
        groupId,
        data: task,
    });

    const {
        register,
        formState: { errors },
        watch,
        setValue,
        control,
    } = form;
    const [scrolled, setScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!data) return <>Loading...</>

    console.log(task);

    const isExist = task?.assignees?.some(a => a.id == data.id);

    const isDisabled = data.role !== "ADMIN";

    const handleScroll = () => {
        if (scrollRef.current) {
            setScrolled(scrollRef.current.scrollTop > 0);
        }
    };

    const assigneeIds = watch("assignees") || [];

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 h-full min-h-0"
        >
            {/* HEADER */}
            <div
                className={cn(
                    "flex items-center gap-2 shrink-0 pb-3",
                    scrolled && "border-b"
                )}
            >
                <div className="flex items-center gap-1 flex-1">
                    <InfoIcon className="w-4 h-4" />
                    <h2 className="text-sm">Thông tin nhiệm vụ</h2>
                </div>
                {(isExist || data.role === "ADMIN") && (
                    <Button type="submit" className="h-8 px-3 gap-2" isLoading={loading}>
                        <Save className="w-4 h-4" />
                        Lưu
                    </Button>
                )}
            </div>

            {/* BODY */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden"
            >
                <div className="flex flex-col gap-5 p-1">
                    {/* TITLE */}
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Tiêu đề</p>
                        <div className="col-span-3 flex flex-col gap-1">
                            <Input disabled={data.role !== "ADMIN"} placeholder="Nhập tiêu đề..." {...register("title")} />
                            {errors.title && (
                                <p className="text-xs text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Mô tả nhiệm vụ</p>
                        <div className="col-span-3 flex flex-col gap-1">
                            <Textarea
                                disabled={data.role !== "ADMIN"}
                                placeholder="Nhập mô tả..."
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Ngày hết hạn</p>
                        <div className="col-span-3 flex flex-col gap-1">
                            <Input disabled={data.role !== "ADMIN"} type="datetime-local" {...register("deadline")} />
                            {errors.deadline && (
                                <p className="text-xs text-red-500">
                                    {errors.deadline.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Mức độ ưu tiên</p>
                        <div className="col-span-3 flex flex-col gap-1">
                            <Controller
                                name="priority"
                                control={control}
                                defaultValue="LOW"
                                render={({ field }) => (
                                    <div className="flex items-center gap-6">
                                        {["LOW", "MEDIUM", "HIGH"].map((level) => (
                                            <Radio
                                                key={level}
                                                value={level}
                                                label={
                                                    level === "LOW"
                                                        ? "Thấp"
                                                        : level === "MEDIUM"
                                                            ? "Trung bình"
                                                            : "Cao"
                                                }
                                                checked={field.value === level}
                                                onChange={(e) => {
                                                    if (isDisabled) return;
                                                    field.onChange(e.target.value);
                                                }}
                                                disabled={isDisabled}
                                            />
                                        ))}
                                    </div>
                                )}
                            />
                            {errors.priority && (
                                <p className="text-xs text-red-500">
                                    {errors.priority.message}
                                </p>
                            )}
                        </div>
                    </div>
                    {method === "UPDATE" && (
                        <div className="grid grid-cols-4 gap-4 items-start">
                            <p className="col-span-1 text-sm">Trạng thái</p>
                            <div className="col-span-3 flex flex-col gap-1">
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue="PENDING"
                                    render={({ field }) => (
                                        <div className="flex items-center gap-6">
                                            {["PENDING", "IN_PROGRESS", "DONE"].map((level) => (
                                                <Radio
                                                    key={level}
                                                    value={level}
                                                    label={
                                                        level === "PENDING"
                                                            ? "Mới"
                                                            : level === "IN_PROGRESS"
                                                                ? "Đang làm"
                                                                : "Đã xong"
                                                    }
                                                    checked={field.value === level}
                                                    onChange={(e) => {
                                                        if (!isExist) return;
                                                        field.onChange(e.target.value);
                                                    }}
                                                    disabled={!isExist}
                                                />
                                            ))}
                                        </div>
                                    )}
                                />
                                {errors.status && (
                                    <p className="text-xs text-red-500">
                                        {errors.status.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ASSIGNEES */}
                    <div className="border-b" />

                    <div className="flex items-center gap-1">
                        <h2 className="text-sm">Phân công thành viên</h2>
                    </div>

                    {isDisabled ? (
                        <div className="flex flex-wrap gap-1">
                            {task?.assignees.map((item) => (
                                <span
                                    key={item.id}
                                    className="px-2 py-0.5 text-xs rounded-md bg-[rgb(var(--color-secondary))]"
                                >
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <SearchMember
                            groupId={groupId}
                            value={assigneeIds.map((id) => ({ id, name: "" }))}
                            onChange={(selected) =>
                                setValue(
                                    "assignees",
                                    selected.map((m) => m.id)
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </form>
    );
}