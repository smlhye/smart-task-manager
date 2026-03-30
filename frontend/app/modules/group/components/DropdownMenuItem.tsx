"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn";
import { ChevronRight } from "lucide-react";
import { DropdownItemType } from "../types/dropdown-item.type";

export const DropdownMenuItem: React.FC<{
    item: DropdownItemType;
    onClose?: () => void;
}> = ({ item, onClose }) => {
    const [open, setOpen] = useState(false);

    if (item.divider) {
        return <div className="my-1 h-px bg-[rgb(var(--color-border))]" />;
    }

    const hasSub = item.subMenu && item.subMenu.length > 0;

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div
                onClick={(e) => {
                    e.stopPropagation();

                    if (!hasSub) {
                        item.onClick?.();

                        if (item.closeOnClick !== false) {
                            onClose?.(); // 🔥 đóng toàn bộ menu
                        }
                    }
                }}
                className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md cursor-pointer",
                    "hover:bg-[rgb(var(--color-muted))]",
                    item.variant === "danger" && "text-red-500"
                )}
            >
                <span>{item.label}</span>
                {hasSub && <ChevronRight className="w-4 h-4" />}
            </div>

            {/* ✅ Submenu */}
            {hasSub && open && (
                <div
                    className={cn(
                        "absolute top-0 min-w-[160px] z-50",
                        item.subMenuPosition === "left"
                            ? "right-full mr-1"
                            : "left-full ml-1"
                    )}
                >
                    <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md shadow-md p-1">
                        {item.subMenu!.map((sub, i) => (
                            <DropdownMenuItem
                                key={i}
                                item={sub}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};