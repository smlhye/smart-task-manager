import { useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "../services/group.service";
import { toast } from "sonner";

export const useChangeRole = (groupId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { userId: number; role: string }) =>
            groupService.changeRole(groupId, data),
        onSuccess: () => {
            toast.success("Thay đổi thành công");
            queryClient.invalidateQueries({
                queryKey: ['member-of-group', groupId],
            });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
}