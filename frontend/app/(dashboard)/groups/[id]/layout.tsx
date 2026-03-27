import GroupContent from "@/app/modules/group/components/GroupContent";

interface GroupPageProps {
    children: React.ReactNode,
    params: Promise<{ id: string }>;
}

export default async function GroupPage({ children, params }: GroupPageProps) {
    const { id } = await params;
    return (
        <GroupContent id={id}>{children}</GroupContent>
    )
}