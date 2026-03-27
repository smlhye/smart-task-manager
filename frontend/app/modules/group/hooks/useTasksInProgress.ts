"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { groupService } from "../services/group.service";
import { CreatedTaskType, FilterTaskType } from "../../tasks/schemas/task.schema";

export const useTasksInProgress = (groupId: number, filter?: FilterTaskType) => {
    const initialTake = filter?.take ?? 20;
    const loadMoreTake = 5;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<CreatedTaskType[], Error>({
        queryKey: ['tasks-in-progress', filter, groupId],
        queryFn: async ({ pageParam }) => {
            const res = await groupService.getTaskInProgress(groupId,{
                ...filter,
                take: pageParam ? loadMoreTake : initialTake,
                cursor: pageParam as string | undefined,
            });
            return res.data!;
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            if (lastPage.length < loadMoreTake) return undefined;
            return lastPage[lastPage.length - 1].updatedAt;
        },
        staleTime: 1000 * 60 * 5,
    });

    const tasks: CreatedTaskType[] = data?.pages.flat() ?? [];

    return {
        tasks,
        loadMore: fetchNextPage,
        hasMore: hasNextPage,
        loadingMore: isFetchingNextPage,
    }
}