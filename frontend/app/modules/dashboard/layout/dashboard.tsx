'use client';
import { cn } from "@/app/lib/cn";
import Header from "@/app/shared/components/layout/header";
import Sidebar from "@/app/shared/components/layout/side-bar";
import { useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className="flex h-screen overflow-hidden bg-[rgb(var(--color-background))]">
            <Sidebar collapsed={collapsed} />
            <div
                className={cn(
                    "flex flex-col flex-1 min-h-screen transition-all duration-300",
                )}
            >
                <Header onToggleSidebar={() => setCollapsed(!collapsed)} />
                <main className="flex-1 p-5 overflow-y-auto h-[calc(100vh-64px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}