'use client';

import { useDebounced } from "@/app/shared/hooks/useDebounced";
import { useState } from "react";
import { useGroup } from "../hooks/useGroup";
import { Button, Input, Modal } from "@/app/shared/components/ui";
import GroupCreateForm from "./GroupCreateForm";
import { Plus, Search } from "lucide-react";
import GroupList from "./GroupList";

export default function GroupListContainer() {
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

            <div className="flex flex-col gap-3 h-full">
                <div className="flex gap-1">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Tìm tên nhóm..." className="pl-9" onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <Button variant="outline" onClick={() => setOpen(true)}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <GroupList
                    groups={groups}
                    loadMore={loadMore}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                />
            </div>
        </div>
    );
}