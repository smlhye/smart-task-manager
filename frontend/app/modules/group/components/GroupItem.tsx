import { cn } from "@/app/lib/cn";
import Link from "next/link";

interface Group {
    id: number;
    name: string;
    hash: string;
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

    return (
        <Link
            href={`/groups/${group.hash}`}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium animate-fade-in",
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
        </Link>
    );
}