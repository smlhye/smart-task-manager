"use client";

import { Modal } from "@/app/shared/components/ui";
import { useGroup } from "../hooks/useGroup";
import GroupListSever from "./GroupListSever";
import { useState } from "react";
import GroupCreateForm from "./GroupCreateForm";
import { useDebounced } from "@/app/shared/hooks/useDebounced";

export default function GroupListClient() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounced(search, 300);
    const { groups, loadMore, hasMore, loadingMore } = useGroup({
        take: 20,
        name: debouncedSearch || undefined,
    });

    const [open, setOpen] = useState(false);

    return (
        <div className="h-full">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <GroupCreateForm onCloseModal={() => setOpen(false)} />
            </Modal>

            <GroupListSever
                groups={groups}
                onOpenModal={() => setOpen(true)}
                loadMore={loadMore}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onSearch={setSearch}
            />
        </div>
    );
}