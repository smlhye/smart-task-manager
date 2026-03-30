import { useQuery } from "@tanstack/react-query"
import { taskService } from "../services/task.service"
import { TasksRecentType } from "../schemas/task.schema";

export const useGetRecentTasks = () => {
    const { data, isLoading, error, refetch } = useQuery<TasksRecentType>({
        queryKey: ['recent-task'],
        queryFn: async () => {
            const res = await taskService.getRecentTasksApi();
            return res.data!;
        },
    });

    return { data, isLoading, error, refetch };
}