import { useMutation } from "@tanstack/react-query";
import { InviteNotificationType } from "../schemas/group.schema";
import { groupService } from "../services/group.service";
import { toast } from "sonner";

export const useInviteMember = (onSuccessCallback?: () => void) => {
    const inviteMutation = useMutation({
        mutationFn: (values: InviteNotificationType) => groupService.inviteMemberApi(values),
        onSuccess: (data) => {
            toast.success('Đã gửi lời mời thành công');
            onSuccessCallback?.();
        },
        onError: (error) => {
            console.error("Invite failed:", error);
        },
    });

    return {
        data: inviteMutation.data?.data,
        error: inviteMutation.error,
        loading: inviteMutation.isPending,
        mutate: inviteMutation.mutate,
        mutateAsync: inviteMutation.mutateAsync,
    };
};