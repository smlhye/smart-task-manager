import { useForm } from "react-hook-form"
import { groupUpdateSchema, GroupUpdateType } from "../schemas/group.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { groupService } from "../services/group.service"
import { toast } from "sonner"
import { id } from "zod/locales"

type Props = {
    onCloseModal: () => void;
    id: number;
    name: string;
}


export const useUpdateGroup = ({ onCloseModal, id, name }: Props) => {
    const queryClient = useQueryClient();
    const form = useForm<GroupUpdateType>({
        resolver: zodResolver(groupUpdateSchema),
        defaultValues: {
            id: id,
            name: name,
        }
    });

    const {
        formState: { isDirty }
    } = form;

    const updateMutation = useMutation({
        mutationFn: groupService.updateApi,
        onSuccess: (res) => {
            toast.success("Cập nhật tên nhóm thành công");
            form.reset();
            onCloseModal();
            queryClient.invalidateQueries({
                queryKey: ['my-groups'],
            })
        },
        onError: (res) => {
            toast.error(res.message);
        }
    })

    const onSubmit = async (values: GroupUpdateType) => {
        if (!isDirty || values.name === name) {
            toast.info("Không có thay đổi nào");
            return;
        }
        updateMutation.mutate(values);
    };

    return {
        form,
        loading: updateMutation.isPending,
        onSubmit,
    }
}