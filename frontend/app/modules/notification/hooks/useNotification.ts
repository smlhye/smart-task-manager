import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterNotification, NotificationListType } from "../schemas/notification.schema";
import { notificationService } from "../services/notification.service";

export const useNotification = (filter?: FilterNotification) => {
    const initialTake = filter?.take ?? 20;
    const loadMoreTake = 5;
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery<NotificationListType, Error>({
        queryKey: ['my-notifications', filter],
        queryFn: async ({pageParam}) => {
            const res = await notificationService.getNotificationsApi({
                ...filter,
                take: pageParam ? loadMoreTake : initialTake,
                cursor: pageParam as string | undefined,
            });
            return res.data ?? [];
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if(!lastPage || lastPage.length === 0) return undefined;
            if(lastPage.length < loadMoreTake) return undefined;
            return lastPage[lastPage.length - 1].createdAt;
        },
        staleTime: 1000 * 60 * 5,
    });

    const notifications: NotificationListType = data?.pages.flat() ?? [];
    return {
        notifications,
        loadMore: fetchNextPage,
        hasMore: hasNextPage,
        loadingMore: isFetchingNextPage,
    }
}