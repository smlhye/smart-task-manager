"use client";

import { usePathname } from "next/navigation";
import GroupItem from "./GroupItem";
import { useEffect, useRef } from "react";
import { GroupSchemaType } from "../schemas/group.schema";

type Props = {
    groups: GroupSchemaType[],
    loadMore: () => void,
    loadingMore: boolean,
    hasMore?: boolean,
}

export default function GroupListWrapper({ groups, loadMore, loadingMore, hasMore }: Props) {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isActive = (hash: string) => pathname?.endsWith(hash);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            {
                root: containerRef.current,
                threshold: 1,
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loadMore]);

    return (
        <nav className="flex flex-col gap-1 h-full overflow-y-auto scrollbar-hidden">
            {groups.map((g: any, index: number) => (
                <GroupItem key={g.id} group={g} index={index} active={isActive(g.hash)} />
            ))}
            <div ref={loadMoreRef} />
            {loadingMore && (
                <p className="text-center text-sm py-2">Loading...</p>
            )}
        </nav>
    );
}