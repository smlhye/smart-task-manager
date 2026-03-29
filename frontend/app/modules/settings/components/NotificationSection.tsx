export default function NotificationSection() {
    return (
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
    );
}