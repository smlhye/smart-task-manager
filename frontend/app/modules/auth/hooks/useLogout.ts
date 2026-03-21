import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { useUserStore } from "../../users/stores/user.store";

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.logoutApi,
        onSuccess: async (res) => {
            useUserStore.getState().setUser(null);
            toast.success('Đăng xuất thành công');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            queryClient.clear();
            window.location.href = '/login';
        },
        onError: (error: any) => {
            toast.error(error.message || 'Đăng xuất không thành công')
        }
    })
}