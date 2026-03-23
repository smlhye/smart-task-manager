"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENU } from "../../types/sidebar.type";
import { cn } from "@/app/lib/cn";

type Props = {
    collapsed: boolean;
};

export default function Sidebar({ collapsed }: Props) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <aside
            className={cn(
                "h-screen flex flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]",
                "transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="h-16 flex items-center justify-center border-b border-[rgb(var(--color-border))] relative overflow-hidden">

                <img
                    src="/images/logo.png"
                    alt="logo"
                    className={cn(
                        "absolute left-1/2 -translate-x-1/2 object-cover w-full h-12 translate-y-[6px]",
                        "transition-all duration-300 ease-in-out",
                    )}
                />
            </div>

            <nav className="flex-1 p-2 space-y-1 animate-fade-in">
                {SIDEBAR_MENU.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={collapsed ? item.name : ""}
                            className={cn(
                                "group flex items-center px-3 py-2 rounded-md text-sm relative",
                                "transition-all duration-200",
                                collapsed ? "justify-center" : "gap-3",
                                active
                                    ? "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
                                    : "text-[rgb(var(--color-muted-foreground))] hover:bg-[rgb(var(--color-muted)/0.5)] hover:text-[rgb(var(--color-foreground))]"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    "group-hover:scale-110"
                                )}
                            />

                            <span
                                className={cn(
                                    "whitespace-nowrap transition-all duration-200",
                                    collapsed
                                        ? "opacity-0 w-0 overflow-hidden"
                                        : "opacity-100"
                                )}
                            >
                                {item.name}
                            </span>
                            {item.hasNew && (
                                <span
                                    className={cn(
                                        "absolute w-2 h-2 rounded-full bg-red-500",
                                        collapsed
                                            ? "top-1 right-0 -translate-x-1/4 -translate-y-1/4"
                                            : "top-1/2 right-2 -translate-y-1/2"
                                    )}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-[rgb(var(--color-border))]">
                <p
                    className={cn(
                        "text-xs text-[rgb(var(--color-muted-foreground))] transition-all",
                        collapsed && "hidden"
                    )}
                >
                    © 2026 Task Manager
                </p>
            </div>
        </aside>
    );
}