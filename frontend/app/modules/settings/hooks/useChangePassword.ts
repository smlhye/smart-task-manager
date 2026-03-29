import { useForm } from "react-hook-form"
import { ChangePasswordFormType, changePasswordFormSchema } from "../../auth/schemas/forgot.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { settingService } from "../services/settings.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLogoutAll } from "../../auth/hooks/useLogoutAll"
import { useLogout } from "../../auth/hooks/useLogout"

export const useChangePassword = () => {
    const router = useRouter();
    const logoutAllMutation = useLogoutAll();
    const logoutMutation = useLogout();
    const form = useForm<ChangePasswordFormType>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            isLogoutAll: false,
        }
    })

    const onSubmit = form.handleSubmit((values) => {
        const { confirmPassword, isLogoutAll, ...payload } = values;
        changePasswordMutation.mutate({
            payload, isLogoutAll
        });
    });

    const changePasswordMutation = useMutation({
        mutationFn: async ({
            payload,
            isLogoutAll,
        }: {
            payload: Omit<ChangePasswordFormType, "confirmPassword" | "isLogoutAll">;
            isLogoutAll: boolean;
        }) => {
            const res = await settingService.changePasswordApi(payload);
            return { res, isLogoutAll };
        },
        onSuccess: ({ isLogoutAll }) => {
            toast.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
            if (isLogoutAll) {
                logoutAllMutation.mutate();
            } else {
                logoutMutation.mutate();
            }
        },
        onError: (res) => {
            toast.error(res.message);
        },
    });

    return {
        form,
        onSubmit,
    }
}