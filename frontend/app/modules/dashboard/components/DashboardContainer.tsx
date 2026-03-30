"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/app/modules/users/hooks/useMeQuery";
import { useUserStore } from "@/app/modules/users/stores/user.store";
import DashboardOverview from "./DashboardOverview";

export default function DashboardContainer() {
    const router = useRouter();
    const { isLoading } = useMeQuery();
    const { user } = useUserStore();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) return null;

    return <DashboardOverview />;
}