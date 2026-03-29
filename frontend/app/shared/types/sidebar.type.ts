import {
    LayoutDashboard,
    ListTodo,
    Users,
    Settings,
    Bell,
} from "lucide-react";

export type SidebarItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    hasNew?: boolean,
    roles?: string[];
};

export const SIDEBAR_MENU: SidebarItem[] = [
    {
        name: "Tổng quan",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        name: "Nhiệm vụ của tôi",
        href: "/tasks",
        icon: ListTodo,
    },
    {
        name: "Nhóm của tôi",
        href: "/groups",
        icon: Users,
    },
    {
        name: "Thông báo của tôi",
        href: "/notifications",
        icon: Bell,
    },
    {
        name: "Cài đặt cấu hình",
        href: "/settings",
        icon: Settings,
    },
];