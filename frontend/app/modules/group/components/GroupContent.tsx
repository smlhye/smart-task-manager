'use client';

import { useState } from "react";
import TaskHeader from "../../tasks/components/layouts/header";
import TaskContainer from "../../tasks/components/TaskContainer";
import TaskDrawer from "../../tasks/components/ui/TaskDrawer";
import { useGetGroupById } from "../hooks/useGetGroupById";
import GroupLoading from "./ui/GroupLoading";
import GroupNotFoundPage from "./ui/GroupNotFound";
import GroupNotValidate from "./ui/GroupNotValidate";
import Drawer from "@/app/shared/components/ui/drawer";
import TaskDrawerTrigger from "../../tasks/components/ui/TaskDrawerTrigger";
import { Button, Modal } from "@/app/shared/components/ui";
import { UserPlus } from "lucide-react";
import { cn } from "@/app/lib/cn";
import GroupAddMemberForm from "./form/GroupAddMemberForm";

interface GroupContentProps {
    id: string | undefined;
}

export default function GroupContent({ id }: GroupContentProps) {
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const groupId = Number(id);
    if (!id || Number.isNaN(groupId) || groupId <= 0) return <GroupNotValidate />

    const { data, loading, error, refetch } = useGetGroupById(groupId);

    if (loading) return <GroupLoading />
    if (error) return <GroupNotFoundPage error={error} refetch={refetch} />

    return (
        <div className="flex h-full w-full relative">
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <GroupAddMemberForm groupId={groupId} onCloseModal={() => setOpenModal(false)} />
            </Modal>
            <div className="flex flex-col w-full h-full border-l bg-[rgb(var(--color-muted))]">
                <TaskHeader
                    id={data?.id}
                    name={data?.name}
                    updatedAt={data?.updatedAt}
                    rightSlot={
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0 hover:bg-[rgb(var(--color-muted))]",
                                )}
                                onClick={() => setOpenModal(true)}
                            >
                                <UserPlus className="w-4 h-4 text-[rgb(var(--color-muted-foreground))]" />
                            </Button>
                            <TaskDrawerTrigger toggle={() => setOpen(true)} />
                        </div>
                    }
                />
                <TaskContainer />
            </div>
            <Drawer open={open} variant="bordered">
                <TaskDrawer onOpenModal={() => { setOpenModal(true); setOpen(false) }} groupId={groupId} toggle={() => setOpen(false)} />
            </Drawer>
        </div>
    );
}