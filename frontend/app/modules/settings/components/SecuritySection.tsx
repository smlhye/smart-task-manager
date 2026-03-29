import { Button, Input, Radio } from "@/app/shared/components/ui";
import { useChangePassword } from "../hooks/useChangePassword";

export default function SecuritySection() {
    const { form, onSubmit } = useChangePassword();

    const {
        register,
        watch,
        formState: { errors },
    } = form;

    const isLogoutAll = watch("isLogoutAll") as boolean;

    return (
        <div className="card space-y-4">
            <div className="flex flex-col">
                <h3>Bảo mật</h3>
                <p>Đổi mật khẩu để bảo vệ tài khoản</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <Input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        {...register("oldPassword")}
                    />
                    {errors.oldPassword && (
                        <p className="text-xs text-red-500">
                            {errors.oldPassword.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        type="password"
                        placeholder="Mật khẩu mới"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col items-start gap-3">
                        <Radio
                            value="false"
                            label="Đổi mật khẩu, và đăng xuất khỏi thiết bị này."
                            checked={!isLogoutAll}
                            onChange={() =>
                                form.setValue("isLogoutAll", false)
                            }
                        />
                        <Radio
                            value="true"
                            label="Đổi mật khẩu, và đăng xuất tất cả các thiết bị."
                            checked={isLogoutAll}
                            onChange={() =>
                                form.setValue("isLogoutAll", true)
                            }
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit">
                        Cập nhật mật khẩu
                    </Button>
                </div>
            </form>
        </div>
    );
}