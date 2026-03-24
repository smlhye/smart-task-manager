export default function StatsSection() {
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
                    <p className="text-lg font-semibold">24</p>
                </div>

                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Hoàn thành
                    </p>
                    <p className="text-lg font-semibold">18</p>
                </div>

                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Đang làm
                    </p>
                    <p className="text-lg font-semibold">4</p>
                </div>

                <div className="card p-3 space-y-1">
                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                        Quá hạn
                    </p>
                    <p className="text-lg font-semibold text-red-500">2</p>
                </div>
            </div>
        </div>
    );
}