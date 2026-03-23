import { Button, Input } from "@/app/shared/components/ui";
import { Edit } from "lucide-react";
import { useUpdateGroup } from "../hooks/useUpdateGroup";

type Props = {
    onCloseModal: () => void;
    id: number;
    name: string;
}

export default function GroupUpdateForm({ onCloseModal, id, name }: Props) {
    const { form, onSubmit, loading } = useUpdateGroup({ onCloseModal, id, name });
    const { register, handleSubmit, formState: { errors } } = form;
    return (
        <div className="flex-1 flex justify-center items-start animate-fade-in">
            <div className="w-full max-w-md space-y-6 bg-[rgb(var(--color-card))]">

                <h2 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">Sửa tên nhóm</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[rgb(var(--color-muted-foreground))]">Tên nhóm</label>
                        <Input
                            type="text"
                            placeholder="Tên nhóm"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2" isLoading={loading}>
                        Cập nhật <span><Edit className="w-4 h-4" /></span>
                    </Button>
                </form>
            </div>
        </div>
    )
}