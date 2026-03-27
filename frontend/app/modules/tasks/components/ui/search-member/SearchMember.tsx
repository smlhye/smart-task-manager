'use client';

import { useState, useRef, useEffect } from "react";
import { Input } from "@/app/shared/components/ui";
import { Search } from "lucide-react";
import { AssigneeTag } from "../AssigneeTag";
import { useDebounced } from "@/app/shared/hooks/useDebounced";
import { useInfiniteScroll } from "@/app/shared/hooks/useInfiniteScroll";
import { useMemberOfGroup } from "../../../hooks/useMembersOfGroup";
import { MemberSearchResultType } from "@/app/modules/users/schemas/user.schema";

type Props = {
    groupId: number;
    value: { id: number; name: string }[];
    onChange: (value: { id: number; name: string }[]) => void;
};

export default function SearchMember({ groupId, value: selectedMembers, onChange }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState("");
    const debouncedValue = useDebounced(search, 300);

    const { members, loadMore, hasMore, loadingMore } = useMemberOfGroup(groupId, {
        name: debouncedValue || undefined,
        take: 20,
    });

    const loadMoreRef = useInfiniteScroll({
        hasMore,
        loading: loadingMore,
        onLoadMore: loadMore,
        root: containerRef.current,
        threshold: 1,
    });

    const stringToColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 60%, 70%)`;
    };

    const getMemberName = (id: number) => {
        const member = members.find(m => m.id === id) || selectedMembers.find(m => m.id === id);
        if (!member) return "Unknown";
        if ("firstName" in member && "lastName" in member) {
            return `${member.firstName} ${member.lastName}`;
        }
        return member.name;
    };

    const handleSelect = (member: MemberSearchResultType) => {
        if (!selectedMembers.some((m) => m.id === member.id)) {
            onChange([...selectedMembers, { id: member.id, name: `${member.firstName} ${member.lastName}` }]);
        }
    };

    const handleRemove = (member: { id: number; name: string }) => {
        onChange(selectedMembers.filter((m) => m.id !== member.id));
    };

    return (
        <div className="flex gap-4 w-full h-96">
            <div className="flex-1 flex flex-col gap-2">
                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Tìm tên thành viên..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto scrollbar-hidden border rounded-md p-2 space-y-2"
                >
                    {members.map((member) => {
                        const avatarColor = stringToColor(member.firstName);
                        const isSelected = selectedMembers.some((m) => m.id === member.id);

                        return (
                            <div
                                key={member.id}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[rgb(var(--color-muted))] transition-colors ${isSelected ? "opacity-50 pointer-events-none" : ""}`}
                                onClick={() => handleSelect(member)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded-md text-white flex items-center justify-center text-xs font-semibold"
                                        style={{ backgroundColor: avatarColor }}
                                    >
                                        {member.firstName[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{`${member.firstName} ${member.lastName}`}</span>
                                        <span className="text-xs text-[rgb(var(--color-muted-foreground))]">{member.email}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={loadMoreRef} />
                    {loadingMore && <p className="text-center py-2 text-sm">Loading...</p>}
                    {members.length === 0 && <p className="text-center text-sm text-gray-500">Không tìm thấy thành viên</p>}
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 border rounded-md p-2 overflow-y-auto scrollbar-hidden">
                <h3 className="text-sm font-semibold">Danh sách đã thêm</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                        <AssigneeTag key={member.id} label={getMemberName(member.id)} onRemove={() => handleRemove(member)} />
                    ))}
                    {selectedMembers.length === 0 && (
                        <p className="text-xs text-gray-500">Chưa có thành viên nào được thêm</p>
                    )}
                </div>
            </div>
        </div>
    );
}