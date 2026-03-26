import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { SearchMemberByEmailType, searchMemberByEmailSchema } from "../schemas/group.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { groupService } from "../services/group.service"

type Props = {
    groupId: number,
}

export const useSearchMemberByEmail = ({ groupId }: Props) => {
    const form = useForm<SearchMemberByEmailType>({
        resolver: zodResolver(searchMemberByEmailSchema),
        defaultValues: {
            email: '',
            groupId,
        }
    })

    const searchMutation = useMutation({
        mutationFn: (values: SearchMemberByEmailType) =>
            groupService.searchMemberByEmailApi(values),
    })

    const onSubmit = form.handleSubmit((async (values) => {
        searchMutation.mutate(values);
    }));

    return {
        data: searchMutation.data?.data,
        error: searchMutation.error,
        form,
        onSubmit,
        loading: searchMutation.isPending,
    }
}