"use client";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-6 animate-fade-in">

            {/* Header */}
            <div>
                <h1>Cài đặt</h1>
                <p>Quản lý tài khoản và tuỳ chỉnh hệ thống.</p>
            </div>

            {/* ================= THÔNG TIN CÁ NHÂN ================= */}
            <div className="card space-y-4">
                <div>
                    <h3>Thông tin cá nhân</h3>
                    <p>Cập nhật thông tin hồ sơ của bạn.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-muted))]" />
                    <button className="btn-outline">Đổi ảnh</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input" placeholder="Tên" />
                    <input className="input" placeholder="Họ" />
                </div>

                <input className="input" placeholder="Email" />

                <button className="btn-primary">Lưu thay đổi</button>
            </div>

            {/* ================= BẢO MẬT ================= */}
            <div className="card space-y-4">
                <div>
                    <h3>Bảo mật</h3>
                    <p>Đổi mật khẩu để bảo vệ tài khoản.</p>
                </div>

                <input className="input" type="password" placeholder="Mật khẩu hiện tại" />
                <input className="input" type="password" placeholder="Mật khẩu mới" />
                <input className="input" type="password" placeholder="Xác nhận mật khẩu" />

                <button className="btn-primary">Cập nhật mật khẩu</button>
            </div>

            {/* ================= GIAO DIỆN ================= */}
            <div className="card space-y-4">
                <div>
                    <h3>Giao diện</h3>
                    <p>Tuỳ chỉnh trải nghiệm sử dụng.</p>
                </div>

                <div className="flex items-center justify-between">
                    <span>Chế độ tối (Dark mode)</span>
                    <input type="checkbox" className="accent-[rgb(var(--color-primary))]" />
                </div>

                <div className="flex items-center justify-between">
                    <span>Thu nhỏ sidebar mặc định</span>
                    <input type="checkbox" className="accent-[rgb(var(--color-primary))]" />
                </div>
            </div>

            {/* ================= THÔNG BÁO ================= */}
            <div className="card space-y-4">
                <div>
                    <h3>Thông báo</h3>
                    <p>Quản lý cách bạn nhận thông báo.</p>
                </div>

                <div className="flex items-center justify-between">
                    <span>Nhận email thông báo</span>
                    <input type="checkbox" className="accent-[rgb(var(--color-primary))]" />
                </div>

                <div className="flex items-center justify-between">
                    <span>Thông báo khi có task mới</span>
                    <input type="checkbox" className="accent-[rgb(var(--color-primary))]" />
                </div>
            </div>

            {/* ================= DANGER ZONE ================= */}
            <div className="card space-y-4 border-[rgb(var(--color-destructive))]">
                <div>
                    <h3 className="text-[rgb(var(--color-destructive))]">
                        Vùng nguy hiểm
                    </h3>
                    <p>Hành động không thể hoàn tác.</p>
                </div>

                <button className="btn-outline text-[rgb(var(--color-destructive))] border-[rgb(var(--color-destructive))] hover:bg-[rgb(var(--color-destructive)/0.1)]">
                    Xoá tài khoản
                </button>
            </div>

        </div>
    );
}