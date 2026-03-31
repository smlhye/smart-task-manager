import GroupNotValidate from "@/app/modules/group/components/ui/GroupNotValidate";
import TaskContainer from "@/app/modules/tasks/components/TaskContainer";

interface GroupPageProps {
    params: Promise<{ id: string }>;
}
export default async function GroupPage({ params }: GroupPageProps) {
    console.log("XIN CHÀO")
    const { id } = await params;
    const groupId = Number(id);
        if (!id || Number.isNaN(groupId) || groupId <= 0) return <GroupNotValidate />
    return (
        <TaskContainer groupId={groupId} />
    )
}