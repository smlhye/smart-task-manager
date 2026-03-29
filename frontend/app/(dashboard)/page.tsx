// 'use client';

// // import { useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { useUserStore } from "./modules/users/stores/user.store";
// // import { useMeQuery } from "./modules/users/hooks/useMeQuery";

// // import { useLogout } from "./modules/auth/hooks/useLogout";
// // import { Button } from "./shared/components/ui";
// // import { useLogoutAll } from "./modules/auth/hooks/useLogoutAll";

// export default function HomePage() {
//     // const router = useRouter();
//     // const { isLoading } = useMeQuery();
//     // const { user } = useUserStore();
//     // const logoutMutation = useLogout();
//     // const logoutAllMutation = useLogoutAll();

//     // useEffect(() => {
//     //     if (!isLoading && !user) {
//     //         router.replace("/login");
//     //     }
//     // }, [isLoading, user, router]);

//     // if (isLoading || !user) return null;

//     return (
//         // <div>
//         //     <h1>Welcome, {user.firstName} {user.lastName}</h1>
//         //     <div className="flex flex-col gap-2 w-50">
//         //         <Button
//         //             onClick={() => logoutMutation.mutate()}
//         //             className="btn btn-primary"
//         //         >
//         //             Logout Current Device
//         //         </Button>

//         //         <Button
//         //             onClick={() => logoutAllMutation.mutate()}
//         //             className="btn btn-danger"
//         //         >
//         //             Logout All Devices
//         //         </Button>
//         //     </div>
//         // </div>
//     );
// }

"use client";

import { CheckCircle2, Clock, ListTodo, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "../modules/users/hooks/useMeQuery";
import { useUserStore } from "../modules/users/stores/user.store";
import { useEffect } from "react";

const stats = [
    {
        label: "Total Tasks",
        value: 128,
        icon: ListTodo,
    },
    {
        label: "Completed",
        value: 86,
        icon: CheckCircle2,
    },
    {
        label: "Pending",
        value: 42,
        icon: Clock,
    },
    {
        label: "Groups",
        value: 6,
        icon: Users,
    },
];

export default function DashboardOverview() {
    const router = useRouter();
    const { isLoading } = useMeQuery();
    const { user } = useUserStore();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) return null;
    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-[rgb(var(--color-muted-foreground))]">
                    Welcome back 👋 Here's what's happening with your tasks.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="p-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-[rgb(var(--color-muted-foreground))]">
                                    {item.label}
                                </div>
                                <Icon className="w-5 h-5 text-[rgb(var(--color-muted-foreground))]" />
                            </div>

                            <div className="mt-2 text-2xl font-semibold">
                                {item.value}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Recent Tasks */}
                <div className="lg:col-span-2 p-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
                    <h2 className="text-lg font-medium mb-4">Recent Tasks</h2>

                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-[rgb(var(--color-muted)/0.5)] transition"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        Task #{item}
                                    </p>
                                    <p className="text-xs text-[rgb(var(--color-muted-foreground))]">
                                        Updated 2 hours ago
                                    </p>
                                </div>

                                <span className="text-xs px-2 py-1 rounded bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]">
                                    In Progress
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="p-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
                    <h2 className="text-lg font-medium mb-4">Activity</h2>

                    <div className="space-y-3 text-sm text-[rgb(var(--color-muted-foreground))]">
                        <p>✔ You completed Task #12</p>
                        <p>👥 Joined "Frontend Team"</p>
                        <p>🆕 Created new task</p>
                        <p>📊 Viewed analytics</p>
                    </div>
                </div>
            </div>
        </div>
    );
}