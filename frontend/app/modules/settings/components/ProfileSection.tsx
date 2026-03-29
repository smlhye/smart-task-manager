import { Button, Input } from "@/app/shared/components/ui";
import { useUserStore } from "../../users/stores/user.store";

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
};

export default function ProfileSection() {
    const user = useUserStore((s) => s.user);
    const avatarColor = stringToColor(user?.id.toString() || '');
    return (
        <div className="card space-y-6">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                    Cập nhật thông tin hồ sơ của bạn.
                </p>
            </div>
            <div className="flex items-center gap-4">
                {!user?.avatarUrl ? (
                    <div
                        className="h-14 w-14 shrink-0 rounded-full flex items-center justify-center text-xl font-semibold text-white"
                        style={{ backgroundColor: avatarColor }}
                    >
                        {user?.firstName?.[0] || "?"}
                    </div>
                ) : (
                    <img src={user?.avatarUrl} alt="avatar" />
                )}

                <button className="btn-outline text-sm">Đổi ảnh</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm">Họ</label>
                    <Input
                        className="input w-full"
                        placeholder="Nhập họ"
                        defaultValue={user?.firstName}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm">Tên</label>
                    <Input
                        className="input w-full"
                        placeholder="Nhập tên"
                        defaultValue={user?.lastName}
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-sm">Email</label>
                <Input
                    className="input w-full"
                    placeholder="Email"
                    defaultValue={user?.email}
                    disabled
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm">Số điện thoại</label>
                <Input
                    className="input w-full"
                    placeholder="Số điện thoại"
                    defaultValue={user?.phone}
                />
            </div>
            <div className="space-y-1">
                <label className="text-sm">Ngày sinh</label>
                <Input
                    type="date"
                    className="input w-full"
                    defaultValue={
                        user?.dateOfBirth
                            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                            : ""
                    }
                />
            </div>
            <div className="flex justify-end">
                <Button className="btn-primary px-6">
                    Lưu thay đổi
                </Button>
            </div>
        </div>
    );
}