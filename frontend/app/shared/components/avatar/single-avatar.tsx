const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
};

export default function SingleAvatar({ name }: { name: string }) {
    const avatarColor = stringToColor(name[0]);
    return (
        <div
            className="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full border-2 border-[rgb(var(--color-card))]"
            style={{ backgroundColor: avatarColor, color: "white" }}
            title={name}
        >
            {name[0]}
        </div>
    )
}