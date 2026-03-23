"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterGroup, GroupSchemaType } from "../schemas/group.schema";
import { groupService } from "../services/group.service";

export const useGroup = (filter?: FilterGroup) => {
    const initialTake = filter?.take ?? 20;
    const loadMoreTake = 5;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<GroupSchemaType[], Error>({
        queryKey: ['my-groups', filter],
        queryFn: async ({ pageParam }) => {
            const res = await groupService.getGroupsApi({
                ...filter,
                take: pageParam ? loadMoreTake : initialTake,
                cursor: pageParam as string | undefined,
            });            
            return res.data ?? [];
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            if (lastPage.length < loadMoreTake) return undefined;
            return lastPage[lastPage.length - 1].updatedAt;
        },
        staleTime: 1000 * 60 * 5,
    });

    const groups: GroupSchemaType[] = data?.pages.flat() ?? [];

    return {
        groups,
        loadMore: fetchNextPage,
        hasMore: hasNextPage,
        loadingMore: isFetchingNextPage,
    }
}