import { useQuery } from "@tanstack/react-query"
import { taskService } from "../services/task.service"
import { CountTaskUserType } from "../schemas/task.schema";

export const useCountTaskUser = () => {
    const { data, isLoading, error, refetch } = useQuery<CountTaskUserType>({
        queryKey: ['count-task-user'],
        queryFn: async () => {
            const res = await taskService.countTaskUserApi();
            return res.data!;
        },
    });

    return { data, isLoading, error, refetch };
}