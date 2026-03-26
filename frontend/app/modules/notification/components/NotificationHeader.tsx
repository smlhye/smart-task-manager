'use client';

export default function NotificationHeader() {
    return (
        <div className="flex items-center justify-between 
            bg-[rgb(var(--color-card))] pb-2">

            <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                    Thông báo
                </h2>

                <span className="text-xs px-2 py-0.5 rounded-full 
                    bg-[rgb(var(--color-muted))] 
                    text-[rgb(var(--color-muted-foreground))]">
                    Mới
                </span>
            </div>
        </div>
    );
}