'use client';

import { useState } from "react";
import MemberListSection from "./MemberListSection";
import MemberSearchSection from "./MemberSearchSection";
import { useMemberOfGroup } from "../../hooks/useMembersOfGroup";
import { useMember } from "@/app/modules/group/hooks/useMember";

type Props = {
    onOpenModal?: () => void;
    groupId: number,
}

export default function MembersSection({ onOpenModal, groupId }: Props) {
    const [search, setSearch] = useState('');
    const { members, loadMore, hasMore, loadingMore } = useMemberOfGroup(
        groupId, {
        name: search || undefined,
        take: 20,
    });
    const { data } = useMember({ groupId });
    const isAdmin = data?.role === "ADMIN";
    return (
        <div className="space-y-2">
            <h3 className="text-xs font-medium text-[rgb(var(--color-muted-foreground))] uppercase">
                Thành viên
            </h3>
            <MemberSearchSection onOpenModal={onOpenModal} groupId={groupId} onSearch={setSearch} />
            <MemberListSection
                isAdmin={isAdmin}
                groupId={groupId}
                members={members}
                loadMore={loadMore}
                loadingMore={loadingMore}
                hasMore={hasMore}
            />
        </div>
    )
}