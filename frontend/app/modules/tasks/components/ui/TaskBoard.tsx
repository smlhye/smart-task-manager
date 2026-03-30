import { cn } from "@/app/lib/cn";
import { CreatedTaskType, TaskStatusType } from "../../schemas/task.schema";
import { Badge, Button, Variant } from "@/app/shared/components/ui";
import { Filter, Plus } from "lucide-react";
import TaskItem from "./TaskItem";
import { useInfiniteScroll } from "@/app/shared/hooks/useInfiniteScroll";
import { useRef, useState } from "react";
import { useMember } from "@/app/modules/group/hooks/useMember";
import { FilterDropdown } from "../FilterDropdown";

type FilterTaskType = "ALL" | "ACTIVE" | "OVERDUE";

const labelFilter: Record<FilterTaskType, string> = {
    ALL: 'Tất cả',
    ACTIVE: 'Còn hạn',
    OVERDUE: 'Quá hạn',
}

type Props = {
    status: TaskStatusType;
    tasks: CreatedTaskType[];
    onCreateTask?: () => void;
    loadMore: () => void,
    loadingMore: boolean,
    hasMore?: boolean,
    groupId?: number,
    onFilterChange?: (filter: string) => void;
    filterValue?: FilterTaskType;
}

const STATUS_TITLES: Record<TaskStatusType, string> = {
    PENDING: "Mới",
    IN_PROGRESS: "Đang xử lý",
    DONE: "Hoàn thành",
};

const STATUS_VARIANTS: Record<TaskStatusType, string> = {
    PENDING: "default",
    IN_PROGRESS: "warning",
    DONE: "success",
};

const PRIORITY_CLASSES: Record<string, string> = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
};

export default function TaskBoard({ loadMore, hasMore, loadingMore, status, tasks, onCreateTask, groupId, onFilterChange, filterValue = 'ALL' }: Props) {
    const title = STATUS_TITLES[status] ?? "Không xác định";
    const variant = STATUS_VARIANTS[status] ?? "default";
    const { data } = useMember({ groupId });
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useInfiniteScroll({
        hasMore,
        loading: loadingMore,
        onLoadMore: loadMore,
        root: containerRef.current,
        threshold: 1,
    });
    if (!data && groupId) return <>Loading...</>;
    return (
        <div className="flex w-full h-full overflow-x-auto">
            <div key={status} className="flex-1 bg-[rgb(var(--color-muted))] rounded-[var(--radius)] flex flex-col">
                <div className="flex items-stretch justify-between bg-[rgb(var(--color-card))] shadow-sm mb-3 rounded-md p-2">
                    <Badge className="rounded-md" variant={variant as Variant}>
                        <h3 className={cn("text-sm font-semibold text-[rgb(var(--color-white))]",
                            "flex-1"
                        )}>
                            {title}
                        </h3>
                    </Badge>
                    <div className="flex gap-1">
                        {(status === 'PENDING' || status === 'IN_PROGRESS') ? (
                            <FilterDropdown
                                onSelectFilter={onFilterChange}
                                trigger={
                                    <div className="flex gap-1 items-center">
                                        <span className="text-xs font-medium">{filterValue && labelFilter[filterValue]}</span>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-7 h-7 p-0",
                                                "flex items-center justify-center",
                                                "rounded-md",
                                                "text-gray-500",
                                                "hover:bg-[rgb(var(--color-muted))]",
                                                "hover:text-gray-800",
                                                "transition"
                                            )}
                                        >
                                            <Filter className="w-4 h-4" />
                                        </Button>
                                    </div>
                                }
                            />
                        ) : <></>}
                        {status === 'PENDING' && (data?.role === "ADMIN" || data?.role === "MANAGER") ? (
                            <Button
                                onClick={onCreateTask}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0 hover:bg-[rgb(var(--color-muted))]",
                                )}
                            >
                                <Plus className="w-4 h-4 text-[rgb(var(--color-muted-foreground))]" />
                            </Button>
                        ) : (<></>
                        )}
                    </div>
                </div>
                <div className="flex-1 px-1 flex flex-col gap-3 overflow-y-auto scrollbar-hidden">
                    {tasks
                        .map((task, index) => (
                            <TaskItem groupId={groupId} index={index} key={task.id} task={task} />
                        ))}
                    <div ref={loadMoreRef} />
                    {loadingMore && <p className="text-center py-2 text-sm">Loading...</p>}
                </div>
            </div>
        </div>
    );
}