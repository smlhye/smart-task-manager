'use client';

import { useEffect, useRef } from "react";
import { NotificationListType } from "../schemas/notification.schema";
import NotificationItem from "./NotificationItem";

interface Props {
    notifications: NotificationListType,
    loadMore: () => void,
    loadingMore: boolean,
    hasMore?: boolean,
}

export default function NotificationList({ notifications, loadMore, loadingMore, hasMore }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            {
                root: containerRef.current,
                threshold: 1,
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loadMore]);

    if (notifications.length === 0) {
        return (
            <div className="p-6 text-center text-[rgb(var(--color-muted-foreground))] text-sm">
                Không có thông báo nào
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col gap-3">
            {notifications.map((item, index) => (
                <div
                    key={item.id}
                    className="rounded-lg hover:bg-[rgb(var(--color-muted)/0.6)] transition"
                >
                    <NotificationItem item={item} index={index}/>
                </div>
            ))}

            <div ref={loadMoreRef} />

            {loadingMore && (
                <p className="text-center text-xs py-3 text-[rgb(var(--color-muted-foreground))]">
                    Đang tải...
                </p>
            )}
        </div>
    );
}