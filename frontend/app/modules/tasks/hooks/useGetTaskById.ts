import { useQuery } from "@tanstack/react-query";
import { CreatedTaskType } from "../schemas/task.schema";
import { taskService } from "../services/task.service";

type Props = {
    groupId: number,
    taskId: number,
    enabled?: boolean,
}

export const getTaskById = ({ groupId, taskId, enabled }: Props) => {
    const { data, isLoading, refetch, error } = useQuery<CreatedTaskType>({
        queryKey: ['group-details', groupId, taskId],
        queryFn: async () => {
            const res = await taskService.findTaskById(groupId, taskId);
            return res?.data!;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!groupId && !!taskId
    })

    return {
        data,
        loading: isLoading,
        error,
        refetch
    }
}