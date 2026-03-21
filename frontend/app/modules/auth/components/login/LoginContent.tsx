import { CheckCircle2 } from "lucide-react";

export default function LoginContent() {
    return (
        <div className="flex flex-col justify-center space-y-6">

            {/* Logo */}
            <div className="w-[auto] h-[100px] shrink-0 overflow-hidden mb-0">
                <img
                    src="/images/logo.png"
                    alt="Smart Task Logo"
                    className="w-full h-full object-cover object-center"
                />
            </div>
            {/* Content */}
            <h1 className="text-3xl font-bold leading-tight text-justify">
                Quản lý công việc theo cách của bạn — gọn gàng, rõ ràng và hiệu quả hơn mỗi ngày
            </h1>

            {/* Description */}
            <p className="text-[rgb(var(--color-muted-foreground))] text-justify">
                Smart Task Manager giúp bạn tổ chức công việc một cách trực quan,
                theo dõi tiến độ dễ dàng và giữ mọi thứ luôn trong tầm kiểm soát
                mà không cần thao tác rườm rà.
            </p>

            {/* Features */}
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Tạo và quản lý công việc nhanh chóng</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Giao diện tối giản, dễ sử dụng</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Theo dõi và cập nhật trạng thái theo thời gian thực</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Hỗ trợ chế độ sáng và tối</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-[rgb(var(--color-muted-foreground))] text-left">
                &copy; 2026 smlhye — Xây dựng với sự tập trung vào tính đơn giản và trải nghiệm thực tế.
            </div>
        </div>
    );
}