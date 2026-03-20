export default function ForgotPasswordContent() {
    return (
        <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
                Lấy lại mật khẩu nhanh chóng 🔐
            </h1>

            <p className="text-[rgb(var(--color-muted-foreground))]">
                Nhập email của bạn để nhận mã OTP, sau đó đặt lại mật khẩu mới một cách an toàn.
            </p>

            <div className="space-y-3 text-sm">
                <p>✅ Bảo mật cao</p>
                <p>✅ OTP xác thực</p>
                <p>✅ Đặt lại nhanh chóng</p>
                <p>✅ Hỗ trợ 24/7</p>
            </div>
        </div>
    );
}