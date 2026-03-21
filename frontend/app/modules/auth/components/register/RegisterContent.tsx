import { CheckCircle2 } from "lucide-react";

export default function RegisterContent() {
    return (
        <div className="hidden md:flex flex-col justify-center space-y-6">

            {/* Logo */}
            <div className="w-[auto] h-[100px] shrink-0 overflow-hidden mb-0">
                <img
                    src="/images/logo.png"
                    alt="Smart Task Logo"
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Header */}
            <h1 className="text-3xl font-bold leading-tight text-justify">
                Bắt đầu hành trình làm việc thông minh bằng những bước đơn giản
            </h1>

            {/* Description */}
            <p className="text-[rgb(var(--color-muted-foreground))] text-justify">
                Tạo tài khoản để quản lý công việc, theo dõi tiến độ và nâng cao năng suất làm việc mỗi ngày.
            </p>

            {/* Features */}
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Quản lý task dễ dàng</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Giao diện hiện đại</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Đồng bộ thời gian thực</span>
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