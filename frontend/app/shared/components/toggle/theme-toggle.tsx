"use client";

import { cn } from "@/app/lib/cn";
import { useThemeStore } from "@/app/stores/theme.store";
import { themes } from "../../types/theme.type";

export function ThemeToggle() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="flex items-center gap-1 p-1 rounded-md border border-[rgb(var(--color-border))]">
            {themes.map(({ key, icon: Icon, label }) => {
                const active = theme === key;

                return (
                    <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className={cn(
                            "flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-all",
                            !active && "hover:bg-[rgb(var(--color-secondary))]/60 hover:shadow-sm backdrop-blur-sm",
                            active && "bg-[rgb(var(--color-primary))] text-white shadow-sm"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </button>
                );
            })}
        </div>
    );
}