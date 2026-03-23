"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/cn";

type Variant = "default" | "danger";

type DropdownItem = {
    label?: string;
    onClick?: () => void;
    variant?: Variant;
    icon?: React.ElementType;
    divider?: boolean;
};

interface DropdownProps {
    trigger: React.ReactNode;
    className?: string;
    onTrigger?: (value: boolean) => void;
    items: DropdownItem[];
}

export function Dropdown({
    trigger,
    items,
    className,
    onTrigger
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                onTrigger?.(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onTrigger]);

    return (
        <div ref={ref} className="relative inline-block">
            <div onClick={() => setOpen(!open)}>{trigger}</div>

            {open && (
                <div
                    className={cn(
                        "absolute right-0 mt-2 min-w-[150px]",
                        "bg-[rgb(var(--color-card))]",
                        "border border-[rgb(var(--color-border))]",
                        "rounded-md shadow-md p-1 z-50",
                        className
                    )}
                >
                    {items.map((item, i) => {
                        if (item.divider) {
                            return (
                                <div
                                    key={`divider-${i}`}
                                    className="my-1 border-t border-[rgb(var(--color-border))]"
                                />
                            );
                        }
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    item.onClick?.();
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                                    "hover:bg-[rgb(var(--color-secondary))] group",
                                    item.variant === "danger" && "text-red-600 hover:bg-red-50"
                                )}
                            >
                                {item.icon && (
                                    <item.icon
                                        className={cn(
                                            "w-4 h-4 transition-transform duration-200",
                                            "group-hover:scale-110"
                                        )}
                                    />
                                )}
                                <span className="whitespace-nowrap">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
}