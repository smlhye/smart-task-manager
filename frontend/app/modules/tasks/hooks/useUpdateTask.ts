import { useForm } from "react-hook-form"
import { createdTaskSchema, CreatedTaskType } from "../schemas/task.schema"
import { zodResolver } from "@hookform/resolvers/zod"

type Props = {
    data?: CreatedTaskType | null
}

export const useUpdateTask = ({ data }: Props) => {
    const form = useForm<CreatedTaskType>({
        resolver: zodResolver(createdTaskSchema),
        defaultValues: data ?? {},
    })

    return {
        form,
        onSubmit: () => {},
        loading: false,
    }
}