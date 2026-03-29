"use client";

import { ThemeToggle } from "@/app/shared/components/toggle/theme-toggle";

export default function AppearanceSection() {
    return (
        <div className="card space-y-4">
            <div>
                <h3>Giao diện</h3>
                <p>Tuỳ chỉnh trải nghiệm sử dụng.</p>
            </div>

            <div className="flex items-center justify-between">
                <span>Chế độ giao diện</span>
                <ThemeToggle />
            </div>

            <div className="flex items-center justify-between">
                <span>Thu nhỏ sidebar mặc định</span>
                <input type="checkbox" className="accent-[rgb(var(--color-primary))]" />
            </div>
        </div>
    );
}