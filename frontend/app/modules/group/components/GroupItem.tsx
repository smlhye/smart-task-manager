import { cn } from "@/app/lib/cn";
import { Button, Modal } from "@/app/shared/components/ui";
import Link from "next/link";
import { useState } from "react";
import GroupUpdateForm from "./GroupUpdate";
import { Edit, MoreHorizontal } from "lucide-react";

interface Group {
    id: number;
    name: string;
    hash: string;
    role: string;
}

interface GroupItemProps {
    group: Group;
    active: boolean;
    index: number;
}

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
};

const getAvatar = (str: string) => {
    if (!str) return "";
    const noAccent = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const clean = noAccent
        .replace(/[^\p{L}0-9\s]/gu, " ")
        .trim();

    const words = clean.split(/\s+/).filter(Boolean);

    if (words.length === 0) return "";
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return (
        words[0][0].toUpperCase() +
        words[1][0].toUpperCase()
    );
};

export default function GroupItem({ group, active, index }: GroupItemProps) {
    const avatar = getAvatar(group.name);
    const avatarColor = stringToColor(group.id.toString());
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Link
                href={`/groups/${group.id}`}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 pr-10 rounded-md text-sm font-medium animate-fade-in relative group overflow-hidden",
                    active
                        ? "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
                        : "text-[rgb(var(--color-muted-foreground))] hover:bg-[rgb(var(--color-secondary)/0.5)] hover:text-[rgb(var(--color-foreground))]"
                )}
                style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "both",
                }}
            >
                <div
                    className="w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-sm"
                    style={{ backgroundColor: avatarColor, color: "white" }}
                >
                    {avatar}
                </div>
                <span className="truncate">{group.name}</span>
                {group.role === "ADMIN" && (
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(true);
                        }}
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2",
                            "w-6 h-6 p-0 z-50",
                            "opacity-0 group-hover:opacity-100",
                            "bg-transparent",
                            "bg-[rgb(var(--color-foreground)/0.08)]",
                            "hover:bg-[rgb(var(--color-foreground)/0.08)]",
                            "transition",
                            "rounded-full cursor-pointer",
                            "animate-scale-in"
                        )}
                    >
                        <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                )}
            </Link>
            <Modal
                open={open}
                onClose={() => setOpen(!open)}
                children={
                    <GroupUpdateForm
                        onCloseModal={() => setOpen(!open)}
                        id={group.id}
                        name={group.name}
                    />
                }
            />
        </div>
    );
}