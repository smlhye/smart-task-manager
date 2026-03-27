import SingleAvatar from "./single-avatar";

export default function MultiAvatar({ names }: { names: string[] }) {
    const displayNames = names.slice(0, 2);
    const extraCount = names.length - 2;

    return (
        <div className="flex items-center -space-x-2">
            {displayNames.map((name, idx) => (
                <SingleAvatar key={idx} name={name} />
            ))}
            {extraCount > 0 && (
                <div className="w-8 h-8 rounded-full border-2 border-[rgb(var(--color-card))] flex items-center justify-center text-xs font-semibold bg-gray-400 text-white">
                    +{extraCount}
                </div>
            )}
        </div>
    );
}