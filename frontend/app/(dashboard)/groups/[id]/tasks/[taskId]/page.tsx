import GroupNotFoundPage from "@/app/modules/group/components/ui/GroupNotFound";
import TaskContainer from "@/app/modules/tasks/components/TaskContainer";
import TaskDetailsPage from "@/app/modules/tasks/components/ui/TaskDetails";

interface TaskItemPageProps {
    params: Promise<{ taskId: string, id: string }>;
}

export default async function TaskItemPage({ params }: TaskItemPageProps) {
    const { id } = await params;
    return (
        <TaskDetailsPage />
    );
}