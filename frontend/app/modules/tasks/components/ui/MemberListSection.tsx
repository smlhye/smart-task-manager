export default function MemberListSection() {
    return (
        <div className="space-y-2">
            {/* Item */}
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors cursor-pointer"
                >
                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-md bg-[rgb(var(--color-secondary))] flex items-center justify-center text-xs font-semibold">
                        A
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            Nguyễn Văn A
                        </span>
                        <span className="text-xs text-[rgb(var(--color-muted-foreground))]">
                            member@email.com
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}