import { getTimeAgo } from "@/app/shared/utils/time-ago";
import { useEffect, useState } from "react";
export function useTimeAgo(date?: Date) {
    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
        if (!date) return;
        const update = () => {
            setTimeAgo(getTimeAgo(date));
        };
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [date]);

    return timeAgo;
}