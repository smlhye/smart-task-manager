export default function GroupContentSkeleton() {
    return (
        <div className="flex h-full w-full relative animate-fade-in">
            <div className="flex flex-col w-full h-full border-l bg-[rgb(var(--color-muted))]">

                {/* Header Skeleton */}
                <div className="flex items-center justify-between p-3 border-b bg-[rgb(var(--color-card))]">
                    <div className="flex flex-col gap-2">
                        <div className="h-5 w-40 skeleton" />
                        <div className="h-3 w-24 skeleton" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 skeleton rounded-md" />
                        <div className="w-8 h-8 skeleton rounded-md" />
                    </div>
                </div>

                {/* Task Columns Skeleton */}
                <div className="flex gap-3 w-full h-full p-3 overflow-x-auto">
                    {[...Array(3)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="flex-1 bg-[rgb(var(--color-muted))] rounded-[var(--radius)] flex flex-col p-2"
                        >
                            {/* Column header */}
                            <div className="flex justify-between items-center mb-3">
                                <div className="h-4 w-20 skeleton" />
                                <div className="w-8 h-8 skeleton rounded-md" />
                            </div>

                            {/* Tasks */}
                            <div className="flex flex-col gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-20 skeleton"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}