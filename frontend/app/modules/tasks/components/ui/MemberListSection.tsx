import { MemberSearchListResultType } from "@/app/modules/users/schemas/user.schema";
import { useInfiniteScroll } from "@/app/shared/hooks/useInfiniteScroll";
import { useEffect, useRef } from "react";

type Props = {
    members: MemberSearchListResultType,
    loadMore: () => void,
    loadingMore: boolean,
    hasMore?: boolean,
}

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
};

export default function MemberListSection({ members, loadMore, loadingMore, hasMore }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useInfiniteScroll({
        hasMore,
        loading: loadingMore,
        onLoadMore: loadMore,
        root: containerRef.current,
        threshold: 1,
    });
    return (
        <div className="space-y-2">
            {members.map((member, index) => {
                const avatarColor = stringToColor(member.firstName);
                return (
                    (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-[rgb(var(--color-muted))] transition-colors cursor-pointer"
                            style={{
                                animationDelay: `${index * 40}ms`,
                                animationFillMode: "both",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-8 w-8 rounded-md text-white flex items-center justify-center text-xs font-semibold"
                                    style={{ backgroundColor: avatarColor }}
                                >
                                    {member.firstName[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {`${member.firstName} ${member.lastName}`}
                                    </span>
                                    <span className="text-xs text-[rgb(var(--color-muted-foreground))]">
                                        {member.email}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${member.role === 'ADMIN' ? 'bg-red-500' :
                                    member.role === 'MEMBER' ? 'bg-blue-500' :
                                        'bg-gray-400'
                                    }`}
                            >
                                {member.role === 'ADMIN' ? 'Quản lý' : 'Thành viên'}
                            </span>
                        </div>
                    )
                )
            })}
            <div ref={loadMoreRef} />
            {loadingMore && <p className="text-center py-2 text-sm">Loading...</p>}
        </div>
    );
}