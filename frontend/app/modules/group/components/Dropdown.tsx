"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/cn";
import { DropdownItemType } from "../types/dropdown-item.type";
import { DropdownMenu } from "./DropdownMenu";

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItemType[];
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, className }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const triggerElement = (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
            }}
        >
            {trigger}
        </div>
    );

    return (
        <div ref={ref} className="relative inline-block">
            {triggerElement}

            {open && (
                <DropdownMenu
                    items={items}
                    onClose={() => setOpen(false)}
                    className={cn(
                        "absolute right-0 mt-2 min-w-[180px] z-50",
                        className
                    )}
                />
            )}
        </div>
    );
};