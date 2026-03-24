'use client';

import { Button } from "@/app/shared/components/ui";

type Props = {
    error: Error;
    refetch: () => void;
};

export default function GroupNotFoundPage({ error, refetch }: Props) {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[rgb(var(--color-muted))] relative">
            <div className="relative z-10 flex flex-col items-center gap-4 p-4">
                <h1 className="text-2xl font-semibold text-red-500">
                    Đã có lỗi xảy ra
                </h1>
                <p className="text-sm text-[rgb(var(--color-muted-foreground))] text-center max-w-md">
                    {error instanceof Error ? error.message : "Có lỗi xảy ra khi tải nhóm"}
                </p>

                <Button
                    onClick={refetch}
                    className="px-6 py-2 rounded-md bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary)/0.85)] transition"
                >
                    Thử lại
                </Button>
            </div>

        </div>
    );
}