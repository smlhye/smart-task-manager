import { useQuery } from "@tanstack/react-query";
import { CreatedTaskType } from "../schemas/task.schema";
import { taskService } from "../services/task.service";

type Props = {
    groupId: number,
    taskId: number,
}

export const getTaskById = ({ groupId, taskId }: Props) => {
    const { data, isLoading, refetch, error } = useQuery<CreatedTaskType>({
        queryKey: ['group-details', groupId],
        queryFn: async () => {
            const res = await taskService.findTaskById(groupId, taskId);
            return res?.data!;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
        enabled: !!groupId,
    })

    return {
        data,
        loading: isLoading,
        error,
        refetch
    }
}