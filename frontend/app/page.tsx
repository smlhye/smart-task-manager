'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "./modules/users/stores/user.store";
import { useMeQuery } from "./modules/users/hooks/useMeQuery";

import { useLogout } from "./modules/auth/hooks/useLogout";
import { Button } from "./shared/components/ui";
import { useLogoutAll } from "./modules/auth/hooks/useLogoutAll";

export default function HomePage() {
    const router = useRouter();
    const { isLoading } = useMeQuery();
    const { user } = useUserStore();
    const logoutMutation = useLogout();
    const logoutAllMutation = useLogoutAll();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) return null;

    return (
        <div>
            <h1>Welcome, {user.firstName} {user.lastName}</h1>
            <div className="flex flex-col gap-2 w-50">
                <Button
                    onClick={() => logoutMutation.mutate()}
                    className="btn btn-primary"
                >
                    Logout Current Device
                </Button>

                <Button
                    onClick={() => logoutAllMutation.mutate()}
                    className="btn btn-danger"
                >
                    Logout All Devices
                </Button>
            </div>
        </div>
    );
}