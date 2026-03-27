'use client';

import { Button, Input, Radio, Textarea } from "@/app/shared/components/ui";
import { InfoIcon, Save } from "lucide-react";
import { useCreateTask } from "../../hooks/useCreateTask";
import { Controller } from "react-hook-form";
import SearchMember from "./search-member/SearchMember";
import { useRef, useState } from "react";
import { cn } from "@/app/lib/cn";

type Props = {
    groupId: number;
}

export default function TaskForm({ groupId }: Props) {
    const { form, onSubmit, loading } = useCreateTask(groupId);
    const { register, formState: { errors }, watch, setValue } = form;
    const [scrolled, setScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            setScrolled(scrollRef.current.scrollTop > 0);
        }
    };    
    const assigneeIds = watch("assignees") || [];

    return (
        <form
            onSubmit={onSubmit}
            name="task-form"
            id="task-form"
            className={cn("flex flex-col gap-3 h-full min-h-0")}
        >
            <div className={cn("flex items-center gap-2 shrink-0 pb-3", scrolled ? "border-b" : "")}>
                <div className="flex items-center gap-1 flex-1">
                    <InfoIcon className="w-4 h-4" />
                    <h2 className="text-sm leading-none">Thông tin nhiệm vụ</h2>
                </div>
                <Button type="submit" className="h-8 px-3 gap-2" isLoading={loading}>
                    <Save className="w-4 h-4" />
                    Lưu
                </Button>
            </div>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden"
            >
                <div className="flex flex-col gap-5 p-1">
                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Tiêu đề</p>
                        <div className="col-span-3 gap-1 flex flex-col">
                            <Input placeholder="Nhập tiêu đề..." {...register("title")} />
                            {errors.title && (
                                <p className="text-xs text-red-500">{errors.title.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Mô tả nhiệm vụ</p>
                        <div className="col-span-3 gap-1 flex flex-col">
                            <Textarea placeholder="Nhập mô tả..." {...register("description")} />
                            {errors.description && (
                                <p className="text-xs text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Ngày hết hạn</p>
                        <div className="col-span-3 gap-1 flex flex-col">
                            <Input type="datetime-local" {...register("deadline")} />
                            {errors.deadline && (
                                <p className="text-xs text-red-500">{errors.deadline.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 items-start">
                        <p className="col-span-1 text-sm">Mức độ ưu tiên</p>
                        <div className="col-span-3 gap-1 flex flex-col">
                            <Controller
                                name="priority"
                                control={form.control}
                                defaultValue="LOW"
                                render={({ field }) => (
                                    <div className="col-span-3 flex items-center gap-6">
                                        {["LOW", "MEDIUM", "HIGH"].map((level) => (
                                            <Radio
                                                key={level}
                                                value={level}
                                                label={level === "LOW" ? "Thấp" : level === "MEDIUM" ? "Trung bình" : "Cao"}
                                                checked={field.value === level}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        ))}
                                    </div>
                                )}
                            />
                            {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
                        </div>
                    </div>

                    <div className="border-b" />
                    <div className="flex items-center gap-1 flex-1">
                        <h2 className="text-sm leading-none">Phân công thành viên</h2>
                    </div>

                    <SearchMember
                        groupId={groupId}
                        value={assigneeIds.map((id) => ({ id, name: "" }))}
                        onChange={(selected) => setValue("assignees", selected.map((m) => m.id))}
                    />
                </div>
            </div>
        </form>
    );
}