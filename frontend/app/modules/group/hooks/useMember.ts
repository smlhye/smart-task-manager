import { useQuery } from "@tanstack/react-query";
import { MemberSearchResultType } from "../../users/schemas/user.schema";
import { groupService } from "../services/group.service";

export const useMember = ({ groupId }: { groupId?: number }) => {
    const { data, isLoading, refetch, error } = useQuery<MemberSearchResultType>({
        queryKey: ['member-details-of-group', groupId],
        queryFn: async () => {
            if (!groupId) throw new Error("groupId is required");
            const res = await groupService.getMember(groupId);
            return res?.data!;
        },
        placeholderData: (prev) => prev,
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