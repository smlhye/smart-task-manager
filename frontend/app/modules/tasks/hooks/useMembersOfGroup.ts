import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterMemberSearchType, MemberSearchListResultType, MemberSearchResponseType } from "../../users/schemas/user.schema";
import { groupService } from "../../group/services/group.service";

export const useMemberOfGroup = (groupId: number, filter?: FilterMemberSearchType) => {
    const initialTake = filter?.take ?? 20;
    const loadMoreTake = 5;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
        MemberSearchResponseType,
        Error
    >({
        queryKey: ['member-of-group', groupId, filter],
        queryFn: async ({ pageParam }) => {
            const take = pageParam ? loadMoreTake : initialTake;
            const res = await groupService.getMemberOfGroupApi(groupId, {
                ...filter,
                take,
                cursor: pageParam as string | undefined,
            });
            return res?.data!;
        },
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
        initialPageParam: undefined,
        staleTime: 1000 * 60 * 5,
    });

    const members: MemberSearchListResultType = data?.pages.flatMap(page => page.members) ?? []

    return {
        members,
        loadMore: fetchNextPage,
        hasMore: hasNextPage,
        loadingMore: isFetchingNextPage,
    }
}