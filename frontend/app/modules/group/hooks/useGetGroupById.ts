import { useQuery } from "@tanstack/react-query"
import { groupService } from "../services/group.service"
import { GroupDetailsType } from "../schemas/group.schema"

export const useGetGroupById = (groupId: number) => {
    const { data, isLoading, refetch, error } = useQuery<GroupDetailsType>({
        queryKey: ['group-details', groupId],
        queryFn: async () => {
            const res = await groupService.getGroupByIdApi(groupId);
            return res?.data!;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!groupId,
    })

    return {
        data,
        loading: isLoading,
        error,
        refetch
    }
}