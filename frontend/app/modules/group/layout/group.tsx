import GroupListContainer from "../components/GroupListContainer";

type GroupLayoutProps = {
    children: React.ReactNode;
};

export default function GroupLayout({ children }: GroupLayoutProps) {
    return (
        <div className="flex gap-3 h-full">
            <aside className="w-64 h-full flex flex-col">
                <GroupListContainer />
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    );
}