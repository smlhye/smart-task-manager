import { Button } from "@/app/shared/components/ui";
import { useCountTask } from "../../hooks/useCountTask";

export default function StatsSection({ groupId }: { groupId: number }) {
    const { data, isLoading, refetch, error } = useCountTask({ groupId });
    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="h-3 w-20 bg-[rgb(var(--color-muted))] rounded" />

                <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="card p-3 space-y-2">
                            <div className="h-3 w-16 bg-[rgb(var(--color-muted))] rounded" />
                            <div className="h-5 w-10 bg-[rgb(var(--color-muted))] rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card p-4 flex flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                    Có lỗi xảy ra
                </p>
                <Button size="sm" onClick={() => refetch()}>
                    Thử lại
                </Button>
            </div>
        );
    }

    if (!data) {
        return <div>Không có dữ liệu</div>;
    }
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-medium text-[rgb(var(--color-muted-foreground))] uppercase">
                Thống kê
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {/* Stat item */}
                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Tổng task
                    </p>
                    <p className="text-lg font-semibold">{data.total}</p>
                </div>

                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Hoàn thành
                    </p>
                    <p className="text-lg font-semibold">{data.done}</p>
                </div>

                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Đang làm
                    </p>
                    <p className="text-lg font-semibold">{data.inProgress}</p>
                </div>

                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Quá hạn
                    </p>
                    <p className="text-lg font-semibold text-red-500">{data.overdue}</p>
                </div>
            </div>
        </div>
    );
}