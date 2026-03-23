import GroupListClient from "../components/GroupListClient";

type GroupLayoutProps = {
    children: React.ReactNode;
};

export default function GroupLayout({ children }: GroupLayoutProps) {
    return (
        <div className="flex gap-3 h-full">
            {/* Sidebar: list of groups */}
            <aside className="w-64 h-full flex flex-col">
                <GroupListClient />
            </aside>

            {/* Main content */}
            <main className="flex-1">{children}</main>
        </div>
    );
}