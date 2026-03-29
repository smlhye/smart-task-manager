export default function DangerZoneSection() {
    return (
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
    );
}