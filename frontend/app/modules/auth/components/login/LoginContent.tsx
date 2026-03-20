export default function LoginContent() {
    return (
        <div className="flex flex-col justify-center space-y-6">

            <h1 className="text-4xl font-bold leading-tight">
                Quản lý công việc theo cách của bạn — gọn gàng, dễ theo dõi hơn mỗi ngày 🚀
            </h1>

            <p className="text-[rgb(var(--color-muted-foreground))]">
                Smart Task Manager giúp bạn sắp xếp công việc, theo dõi tiến độ
                và giữ mọi thứ trong tầm kiểm soát mà không cần quá nhiều thao tác phức tạp.
            </p>

            <div className="space-y-3 text-sm">
                <p>• Tạo và quản lý công việc nhanh chóng</p>
                <p>• Giao diện đơn giản, dễ dùng</p>
                <p>• Cập nhật trạng thái theo thời gian thực</p>
                <p>• Hỗ trợ chế độ sáng / tối</p>
            </div>

            <div className="text-xs text-[rgb(var(--color-muted-foreground))]">
                Được xây dựng bởi smlhye — tập trung vào sự đơn giản và trải nghiệm thực tế.
            </div>
        </div>
    );
}