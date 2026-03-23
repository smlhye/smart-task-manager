import { DashboardLayout } from "../modules/dashboard/layout/dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>{children}</DashboardLayout>
    )
}