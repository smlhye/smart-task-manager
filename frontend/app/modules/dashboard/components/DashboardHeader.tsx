export default function DashboardHeader() {
    return (
        <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
                Tổng quan
            </h1>

            <p className="text-sm text-[rgb(var(--color-muted-foreground))] leading-relaxed">
                Chào mừng bạn quay lại 👋
                <span className="block">
                    Đây là tình hình công việc của bạn
                </span>
            </p>
        </div>
    );
}