import { useQuery } from "@tanstack/react-query"
import { UnreadCountType } from "../schemas/notification.schema"
import { notificationService } from "../services/notification.service"

export const useCountUnreadNotification = () => {
    const { data, isLoading, refetch, error } = useQuery<UnreadCountType>({
        queryKey: ['count-unread-notifications'],
        queryFn: async () => {
            const res = await notificationService.countUnreadNotifications();
            return res?.data!;
        },
        staleTime: 1000 * 60 * 5,
    });

    return {
        data,
        loading: isLoading,
        error,
        refetch
    }
}