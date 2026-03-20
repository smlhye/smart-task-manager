export default function RegisterContent() {
    return (
        <div className="hidden md:flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold">
                Bắt đầu hành trình làm việc thông minh 🚀
            </h1>

            <p className="text-[rgb(var(--color-muted-foreground))]">
                Tạo tài khoản để quản lý công việc, theo dõi tiến độ và
                nâng cao năng suất làm việc mỗi ngày.
            </p>

            <div className="space-y-2 text-sm">
                <p>✅ Quản lý task dễ dàng</p>
                <p>✅ Giao diện hiện đại</p>
                <p>✅ Đồng bộ thời gian thực</p>
                <p>✅ Hỗ trợ dark mode</p>
            </div>
        </div>
    );
}