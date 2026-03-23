import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordContent() {
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

            {/* Header */}
            <h1 className="text-3xl font-bold leading-tight text-justify">
                Lấy lại mật khẩu nhanh chóng - xác thực otp
            </h1>

            {/* Description */}
            <p className="text-[rgb(var(--color-muted-foreground))] text-justify">
                Nhập email của bạn để nhận mã OTP, sau đó đặt lại mật khẩu mới một cách an toàn.
            </p>

            {/* Features */}
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Bảo mật cao</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>OTP xác thực</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Đặt lại nhanh chóng</span>
                </div>

                <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Hỗ trợ 24/7</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-[rgb(var(--color-muted-foreground))] text-left">
                &copy; 2026 smlhye — Xây dựng với sự tập trung vào tính đơn giản và trải nghiệm thực tế.
            </div>
        </div>
    );
}