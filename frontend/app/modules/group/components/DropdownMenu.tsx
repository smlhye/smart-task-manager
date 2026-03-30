"use client";

import { cn } from "@/app/lib/cn";
import { DropdownMenuItem } from "./DropdownMenuItem";
import { DropdownItemType } from "../types/dropdown-item.type";

export const DropdownMenu: React.FC<{
    items: DropdownItemType[];
    className?: string;
    onClose?: () => void;
}> = ({ items, className, onClose }) => {
    return (
        <div
            className={cn(
                "bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md shadow-md p-1",
                className
            )}
        >
            {items.map((item, i) => (
                <DropdownMenuItem key={i} item={item} onClose={onClose} />
            ))}
        </div>
    );
};