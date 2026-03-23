"use client";

import { cn } from "@/app/lib/cn";
import { Button } from "./button";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmMessage?: string;
    className?: string;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    confirmMessage = "Bạn có chắc chắn muốn thực hiện hành động này?",
    className,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className={cn(
                    "bg-[rgb(var(--color-card))] text-[rgb(var(--color-card-foreground))] rounded-[var(--radius)] shadow-lg p-6 w-[320px] max-w-full animate-scale-in",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-[rgb(var(--color-foreground))] text-sm mb-4">
                    {confirmMessage}
                </p>
                <div className="flex justify-end gap-3 mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="hover:bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onConfirm}
                        className="hover:opacity-90"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}