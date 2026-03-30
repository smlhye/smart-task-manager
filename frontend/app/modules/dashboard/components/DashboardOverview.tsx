"use client";

import { CheckCircle2, Clock, ListTodo, Users } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import StatsGrid from "./StateGrid";
import RecentTasks from "./RecentTask";
import Activity from "./Activity";

const stats = [
    { label: "Total Tasks", value: 128, icon: ListTodo },
    { label: "Completed", value: 86, icon: CheckCircle2 },
    { label: "Pending", value: 42, icon: Clock },
    { label: "Overdue", value: 42, icon: Clock },
    { label: "Groups", value: 6, icon: Users },
];

export default function DashboardOverview() {
    return (
        <div className="h-full overflow-y-auto scrollbar-hidden">
            <div className="space-y-4">
                <DashboardHeader />

                <StatsGrid />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <RecentTasks />
                    <Activity />
                </div>
            </div>
        </div>
    );
}