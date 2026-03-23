import GroupContent from "@/app/modules/group/components/GroupContent";

interface GroupPageProps {
    params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
    const { id } = await params;
    return (
        <GroupContent id={id} />
    )
}