"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn";

export function Dropdown({
    trigger,
    items,
}: {
    trigger: React.ReactNode;
    items: { label: string; onClick: () => void }[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <div onClick={() => setOpen(!open)}>{trigger}</div>

            {open && (
                <div
                    className={cn(
                        "absolute right-0 mt-2 min-w-[150px]",
                        "bg-[rgb(var(--color-card))]",
                        "border border-[rgb(var(--color-border))]",
                        "rounded-md shadow-md p-1 z-50"
                    )}
                >
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                item.onClick();
                                setOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[rgb(var(--color-secondary))]"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}