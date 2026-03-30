import { useQuery } from "@tanstack/react-query"
import { RolesType } from "../schemas/group.schema"
import { groupService } from "../services/group.service"

export const useGetRoles = () => {
    const { data, isLoading, error, refetch } = useQuery<RolesType>({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await groupService.getRolesApi();
            return res?.data!;
        },
        staleTime: 1000 * 60 * 30,
    });

    return { data, isLoading, error, refetch };
};