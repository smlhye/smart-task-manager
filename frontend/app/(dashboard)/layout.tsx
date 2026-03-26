import { DashboardLayout } from "../modules/dashboard/layout/dashboard";
import { WebSocketProvider } from "../modules/notification/contexts/websocket.context";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <WebSocketProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </WebSocketProvider>
    )
}