import SingleAvatar from "./single-avatar";

export default function MultiAvatar({ names }: { names: string[] }) {
    const displayNames = names.slice(0, 2);
    const extraCount = names.length - 2;

    return (
        <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center -space-x-2 shrink-0">
                {displayNames.map((name, idx) => (
                    <div
                        key={idx}
                        className="relative z-10 ring-2 ring-[rgb(var(--color-card))] rounded-full"
                        title={name}
                    >
                        <SingleAvatar name={name} />
                    </div>
                ))}

                {extraCount > 0 && (
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center
                            text-[10px] font-semibold
                            bg-[rgb(var(--color-muted))] text-foreground
                            ring-2 ring-[rgb(var(--color-card))]
                            hover:bg-[rgb(var(--color-muted-foreground))] hover:text-white
                            transition"
                        title={names.slice(2).join(", ")}
                    >
                        +{extraCount}
                    </div>
                )}
            </div>
            <div className="text-xs text-[rgb(var(--color-muted-foreground))] truncate">
                <span className="truncate">
                    {displayNames.join(", ")}
                </span>

                {extraCount > 0 && (
                    <span className="ml-1">
                        +{extraCount}
                    </span>
                )}
            </div>
        </div>
    );
}