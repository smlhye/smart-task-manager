import { Button, Input } from "@/app/shared/components/ui";
import { useSearchMemberByEmail } from "../../hooks/useSearchMemberByEmail";
import { Plus, Search, UserPlus } from "lucide-react";
import { useInviteMember } from "../../hooks/useInviteMember";

type Props = {
    groupId: number,
    onCloseModal: () => void;
}

export default function GroupAddMemberForm({ groupId, onCloseModal }: Props) {
    const { data, form, error, loading, onSubmit } = useSearchMemberByEmail({ groupId });
    const { register, formState: { errors } } = form;
    const { data: inviteResponse, error: inviteError, loading: inviteLoading, mutate } = useInviteMember(() => {
        onCloseModal();
    });

    const handleInvite = () => {
        if (!data) return;
        mutate({
            receiverId: data.id,
            groupId: groupId,
        })
    }

    return (
        <div className="flex flex-col items-center justify-start w-full animate-fade-in space-y-3">
            <div className="w-full max-w-md rounded-2xl bg-[rgb(var(--color-card))]">
                <h2 className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
                    Mời thành viên vào nhóm
                </h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[rgb(var(--color-muted-foreground))]">
                            Email
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Input
                                    type="email"
                                    placeholder="Nhập email người dùng..."
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="h-10 w-10 p-0 flex items-center justify-center rounded-full"
                                isLoading={loading}
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            {data && (
                <div className="w-full max-w-md p-3 rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] space-y-4 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                                {data.firstName} {data.lastName}
                            </p>
                            <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                                {data.email}
                            </p>
                        </div>
                        <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${data.isMember
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                                }`}
                        >
                            {data.isMember ? "Đã tham gia" : "Chưa tham gia"}
                        </span>
                    </div>
                    {!data.isMember && (
                        <Button className="w-full" onClick={handleInvite} isLoading={inviteLoading}>
                            <UserPlus className="w-4 h-4" /> Mời vào nhóm
                        </Button>
                    )}
                    {inviteError && (
                        <p className="text-xs text-red-500 text-center mt-2">
                            {(inviteError as any)?.message || "Có lỗi xảy ra"}
                        </p>
                    )}
                </div>
            )}
            {error && (
                <div className="w-full max-w-md">
                    <p className="text-sm text-red-500 text-center">
                        {(error as any)?.message || "Có lỗi xảy ra"}
                    </p>
                </div>
            )}
        </div>
    );
}