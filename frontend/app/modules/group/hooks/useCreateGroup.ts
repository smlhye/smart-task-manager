import { useForm } from "react-hook-form"
import { groupCreateSchema, GroupCreateType } from "../schemas/group.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "../services/group.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { encodeId } from "@/app/shared/utils/hashid"

type Props = {
    onCloseModal: () => void;
}

export const useCreateGroup = ({ onCloseModal }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const form = useForm<GroupCreateType>({
        resolver: zodResolver(groupCreateSchema),
        defaultValues: {
            name: "",
        }
    })

    const createGroupMutation = useMutation({
        mutationFn: groupService.createApi,
        onSuccess: (res) => {
            toast.success("Tạo nhóm mới thành công");
            form.reset();
            onCloseModal();
            router.push(`/groups/${res.data?.id}`);

            queryClient.invalidateQueries({
                queryKey: ['my-groups'],
            })
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })

    const onSubmit = async (values: GroupCreateType) => {
        createGroupMutation.mutate(values);
    };

    return {
        form,
        loading: createGroupMutation.isPending,
        onSubmit,
    }
}