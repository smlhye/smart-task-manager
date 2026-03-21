import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export const useLogoutAll = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.logoutAllApi,
        onSuccess: async (res) => {
            toast.success(res.message);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            queryClient.clear();
            window.location.href = '/login';
        },
        onError: (error: any) => {
            toast.error(error.message || 'Đăng xuất tất cả thiết bị không thành công')
        }
    })
}