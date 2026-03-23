"use client";

import { useMeQuery } from "@/app/modules/users/hooks/useMeQuery";
import { useUserStore } from "@/app/modules/users/stores/user.store";
import { ChevronDown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmDialog, Dropdown } from "../ui";
import { getUserMenu } from "@/app/modules/dashboard/constants/user-menu";
import { useLogout } from "@/app/modules/auth/hooks/useLogout";

type Props = {
    onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: Props) {
    const router = useRouter();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const { user } = useUserStore();
    const { isLoading } = useMeQuery();
    const [rotate, setRotate] = useState<boolean>(false);
    const logoutMutation = useLogout();
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) return null;
    return (
        <header className="h-16 flex items-center justify-between px-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-md hover:bg-[rgb(var(--color-muted)/0.5)] transition"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <h2 className="text-sm font-medium">
                    Màn hình chính
                </h2>
            </div>
            <div className="flex items-center gap-1 text-sm">
                <span className="text-[rgb(var(--color-muted-foreground))]">
                    Xin chào,
                </span>

                <span className="font-medium text-[rgb(var(--color-foreground))]">
                    {user?.lastName || "User"}
                </span>
                <Dropdown
                    className="w-[200px]"
                    trigger={
                        <button
                            onClick={() => setRotate(!rotate)}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[rgb(var(--color-muted)/0.5)] transition"
                        >
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${rotate ? "rotate-180" : ""}`}
                            />
                        </button>
                    }
                    onTrigger={(close: boolean) => setRotate(close)}
                    items={getUserMenu(router, () => setShowDialog(true))}
                />
            </div>
            <ConfirmDialog
                open={showDialog}
                onClose={() => setShowDialog(false)} 
                onConfirm={() => logoutMutation.mutate()}
                confirmMessage="Bạn có muốn đăng xuất không?"/>
        </header>
    );
}