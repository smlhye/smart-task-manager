import { useQuery } from "@tanstack/react-query"
import { taskService } from "../services/task.service"
import { CountTaskType } from "../schemas/task.schema";

export const useCountTask = ({ groupId }: { groupId: number }) => {
    const { data, isLoading, error, refetch } = useQuery<CountTaskType>({
        queryKey: ['count-task', groupId],
        queryFn: async () => {
            const res = await taskService.countTaskApi(groupId);
            return res.data!;
        },
        enabled: !!groupId,
    });

    return { data, isLoading, error, refetch };
}