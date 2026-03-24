'use client';
import { Button, Modal } from "@/app/shared/components/ui";
import { useState } from "react";
import GroupCreateForm from "./GroupCreateForm";

export default function GroupPageInit() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[rgb(var(--color-muted))] relative">
            <div className="relative z-10 flex flex-col items-center gap-4 p-4">
                <h1 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                    Chưa chọn nhóm nào
                </h1>
                <p className="text-sm text-[rgb(var(--color-muted-foreground))] text-center max-w-md">
                    Hãy chọn nhóm để bắt đầu quản lý công việc và cộng tác cùng nhóm
                    Hoặc tạo nhóm mới để bắt đầu công việc mới
                </p>
                <Button
                    onClick={() => setOpen(true)}
                    className="px-6 py-2 rounded-md bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary)/0.85)] transition"
                >
                    Tạo nhóm
                </Button>
            </div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}>
                <GroupCreateForm onCloseModal={() => setOpen(false)} />
            </Modal>
        </div>
    );
}