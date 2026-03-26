'use client';

import { Button, Input } from "@/app/shared/components/ui";
import { useDebounced } from "@/app/shared/hooks/useDebounced";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    onOpenModal?: () => void;
    groupId: number;
    onSearch?: (value: string) => void;
};

export default function MemberSearchSection({ onOpenModal, onSearch }: Props) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounced(search, 300);
    useEffect(() => {
        onSearch?.(debouncedSearch);
    }, [debouncedSearch, onSearch]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    return (
        <div className="flex gap-1">
            <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Tìm tên thành viên..." className="pl-9" value={search} onChange={handleChange} />
            </div>
            <Button variant="outline" onClick={onOpenModal}>
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}