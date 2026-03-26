'use client';

import { useNotification } from "../hooks/useNotification";
import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";

export default function NotificationContainer() {
    const { notifications, loadMore, hasMore, loadingMore } = useNotification({ take: 20 });

    return (
        <div className="w-full h-full flex justify-start">
            <div className="w-full h-full flex flex-col 
                bg-[rgb(var(--color-card))] overflow-hidden">
                <NotificationHeader />

                <div className="flex-1 px-3 pt-3 bg-[rgb(var(--color-muted))] overflow-hidden">
                    <div className="max-w-xl h-full scrollbar-hidden overflow-y-auto">
                        <NotificationList
                            notifications={notifications}
                            loadMore={loadMore}
                            hasMore={hasMore}
                            loadingMore={loadingMore}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}