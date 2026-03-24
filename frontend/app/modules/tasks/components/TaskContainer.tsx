type Props = {
    id?: number,
    createdAt?: string,
}

export default function TaskContainer({ id, createdAt }: Props) {
    return (
        <div className="bg-[rgb(var(--color-card))] h-full m-3 border border-[rgb(var(--color-border))] rounded-[var(--radius)] p-4">
            <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                ID nhóm: {id}
            </p>
            <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                Tạo lúc: {new Date(createdAt!).toLocaleString()}
            </p>
        </div>
    )
}