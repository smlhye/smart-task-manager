import { useTimeAgo } from "../../../../shared/hooks/useTimeAgo";

type Props = {
    name?: string;
    updatedAt?: string;
    rightSlot?: React.ReactNode;
    id?: number;
};

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
};

const getAvatar = (str?: string) => {
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

export default function TaskHeader({ id, name, updatedAt, rightSlot }: Props) {
    const avatar = getAvatar(name);
    const avatarColor = stringToColor(id!.toString());
    const timeAgo = useTimeAgo(
        updatedAt ? new Date(updatedAt) : undefined
    );
    return (
        <div className="flex items-center justify-between pb-3 bg-[rgb(var(--color-card))]">
            <div className="flex items-stretch gap-3 pl-3">
                <div
                    className="px-2 flex items-center justify-center rounded-md text-xs font-semibold text-white"
                    style={{ backgroundColor: avatarColor }}
                >
                    {avatar}
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-sm font-semibold">
                        {name || "Untitled"}
                    </h2>

                    {timeAgo && (
                        <p className="text-xs text-[rgb(var(--color-muted-foreground))] opacity-80">
                            {timeAgo}
                        </p>
                    )}
                </div>
            </div>
            {rightSlot && (
                <div className="flex items-center gap-2">
                    {rightSlot}
                </div>
            )}
        </div>
    );
}