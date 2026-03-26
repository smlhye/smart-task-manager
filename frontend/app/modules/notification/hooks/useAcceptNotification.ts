import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";

export const useAcceptNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            notificationService.acceptApi(id),

        onMutate: async (id: number) => {
            await queryClient.cancelQueries({
                queryKey: ["my-notifications"],
            });

            const previousData = queryClient.getQueriesData({
                queryKey: ["my-notifications"],
            });

            queryClient.setQueriesData(
                { queryKey: ["my-notifications"] },
                (old: any) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page: any[]) =>
                            page.map((n: any) =>
                                n.id === id
                                    ? { ...n, isRead: true }
                                    : n
                            )
                        ),
                    };
                }
            );

            queryClient.setQueriesData(
                { queryKey: ['count-unread-notifications'] },
                (old: any) => {
                    if (!old) return old;

                    return {
                        ...old,
                        count: Math.max(0, old.count - 1),
                    };
                }
            )

            return { previousData };
        },
        onError: (_err, _id, context) => {
            if (!context?.previousData) return;

            context.previousData.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-notifications"],
            });
        },
    });
};