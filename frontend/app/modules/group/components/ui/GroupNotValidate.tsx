export default function GroupNotValidate() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[rgb(var(--color-muted))] relative">
            <div className="relative z-10 flex flex-col items-center gap-4 p-4">
                <h1 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                    ID nhóm không hợp lệ
                </h1>
                <p className="text-sm text-[rgb(var(--color-muted-foreground))] text-center max-w-md">
                    Vui lòng kiểm tra lại đường dẫn hoặc chọn nhóm khác
                </p>
            </div>
        </div>
    );
}