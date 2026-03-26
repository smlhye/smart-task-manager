'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/app/lib/cn";
import { ConfirmDialog } from "@/app/shared/components/ui";

import { useTimeAgo } from "../../../shared/hooks/useTimeAgo";
import { useAcceptNotification } from "../hooks/useAcceptNotification";
import { useRejectNotification } from "../hooks/useRejectNotification";
import { useMarkAsReadNotification } from "../hooks/useMarkAsReadNotification";
import { useDeletetNotification } from "../hooks/useDeleteNotification";

import { NotificationItemType } from "../schemas/notification.schema";

interface Props {
    item: NotificationItemType;
    index: number;
}

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
};

export default function NotificationItem({ item, index }: Props) {
    const router = useRouter();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { mutate: markAsRead, isPending: isReading } = useMarkAsReadNotification();
    const { mutate: accept, isPending: accepting } = useAcceptNotification();
    const { mutate: reject, isPending: rejecting } = useRejectNotification();
    const { mutate: remove, isPending: deleting } = useDeletetNotification();

    const avatarColor = stringToColor(item.id.toString());
    const timeAgo = useTimeAgo(
        item.createdAt ? new Date(item.createdAt) : undefined
    );

    const handleClick = () => {
        if (!item.isRead && !isReading) {
            markAsRead(item.id);
        }
    };

    const handleAccept = () => {
        accept(item.id, {
            onSuccess: () => {
                toast.success("Tham gia nhóm thành công");
                router.push(`/groups/${item.groupId}`);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    const handleReject = () => {
        reject(item.id, {
            onSuccess: () => toast.success("Đã từ chối lời mời"),
            onError: (err) => toast.error(err.message),
        });
    };

    const handleDelete = () => {
        remove(item.id, {
            onSuccess: () => {
                toast.success("Xóa thông báo thành công");
                setShowDeleteDialog(false);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    return (
        <>
            <div
                onClick={handleClick}
                className={cn(
                    "group relative flex gap-3 p-3 rounded-xl",
                    "border border-[rgb(var(--color-border))]",
                    "bg-[rgb(var(--color-card))]/80 backdrop-blur",
                    "transition-all duration-300 ease-out",
                    "animate-fade-in",

                    !item.isRead
                        ? "cursor-pointer active:scale-[0.98] hover:shadow-md"
                        : "opacity-70 cursor-default"
                )}
                style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "both",
                }}
            >
                {!item.isRead && (
                    <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}

                <button
                    disabled={deleting}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                    }}
                    className={cn(
                        "absolute top-2 right-2 p-1.5 rounded-md transition",
                        "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                        "bg-white dark:bg-zinc-900",
                        "shadow-md",
                        "hover:bg-red-50 dark:hover:bg-red-900/20",
                        "disabled:opacity-50 disabled:pointer-events-none"
                    )}
                >
                    {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                    ) : (
                        <Trash2 className="h-4 w-4 text-red-500 group-hover:scale-110 transition" />
                    )}
                </button>

                <div
                    className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: avatarColor }}
                >
                    {item.senderFullname?.[0] || "?"}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                            {item.senderFullname}
                        </p>

                        <span className="text-[11px] text-[rgb(var(--color-muted-foreground))]">
                            {timeAgo}
                        </span>
                    </div>
                    <p className="text-sm text-[rgb(var(--color-muted-foreground))] line-clamp-2">
                        {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-primary))]">
                            {item.groupName}
                        </span>
                        {item.status === "PENDING" && (
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={accepting}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccept();
                                    }}
                                    className="px-2 py-1 text-[11px] font-medium rounded-md bg-[rgb(var(--color-primary))] text-white hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {accepting ? "..." : "Xác nhận"}
                                </button>

                                <button
                                    disabled={rejecting}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject();
                                    }}
                                    className="px-2 py-1 text-[11px] font-medium rounded-md border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-secondary))] transition disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                confirmMessage="Bạn có muốn xóa thông báo này không?"
            />
        </>
    );
}