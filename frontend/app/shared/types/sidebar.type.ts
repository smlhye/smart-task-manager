import {
    LayoutDashboard,
    ListTodo,
    Users,
    BarChart3,
    Settings,
} from "lucide-react";

export type SidebarItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
};

export const SIDEBAR_MENU: SidebarItem[] = [
    {
        name: "Overview",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        name: "My Tasks",
        href: "/tasks",
        icon: ListTodo,
    },
    {
        name: "Groups",
        href: "/groups",
        icon: Users,
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
];