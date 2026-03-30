import { cn } from "@/app/lib/cn";
import { RolesDropdown } from "@/app/modules/group/components/RolesDropdown";
import { useChangeRole } from "@/app/modules/group/hooks/useChangeRole";
import { useGetRoles } from "@/app/modules/group/hooks/useGetRoles";
import { MemberSearchListResultType } from "@/app/modules/users/schemas/user.schema";
import { Button } from "@/app/shared/components/ui";
import { useInfiniteScroll } from "@/app/shared/hooks/useInfiniteScroll";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
    groupId: number,
    members: MemberSearchListResultType,
    loadMore: () => void,
    loadingMore: boolean,
    hasMore?: boolean,
    isAdmin?: boolean,
}

const permissionTable: Record<
    string,
    { label: string; className: string }
> = {
    ADMIN: {
        label: "Admin",
        className: "bg-red-500",
    },
    MANAGER: {
        label: "Quản lý",
        className: "bg-yellow-500",
    },
    MEMBER: {
        label: "Thành viên",
        className: "bg-blue-500",
    },
    VIEWER: {
        label: "Người xem",
        className: "bg-gray-400",
    },
};

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
};

export default function MemberListSection({ isAdmin, groupId, members, loadMore, loadingMore, hasMore }: Props) {
    const { data: roles } = useGetRoles();
    const { mutate: changeRole, isPending } = useChangeRole(groupId);
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
                const role = permissionTable[member.role] ?? {
                    label: "Không xác định",
                    className: "bg-gray-300",
                };
                return (
                    (
                        <div
                            key={member.id}
                            className={cn(
                                "flex items-center gap-3",
                                "p-2 rounded-md",
                                "hover:bg-[rgb(var(--color-muted))]",
                                "transition-colors cursor-pointer"
                            )}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                    className="h-8 w-8 rounded-md text-white flex items-center justify-center text-xs font-semibold shrink-0"
                                    style={{ backgroundColor: avatarColor }}
                                >
                                    {member.lastName.split(' ')[member.lastName.split(' ').length - 1][0]}
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate">
                                        {`${member.firstName} ${member.lastName}`}
                                    </span>
                                    <span className="text-xs text-[rgb(var(--color-muted-foreground))] truncate">
                                        {member.email}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={cn(
                                        "text-xs font-semibold text-white",
                                        "px-2 py-1 rounded-full",
                                        "w-[100px] text-center",
                                        role.className
                                    )}
                                >
                                    {role.label}
                                </span>

                                {isAdmin && (
                                    <RolesDropdown
                                        roles={roles?.roles}
                                        onSelectRole={(role) => {
                                            changeRole({
                                                userId: member.id,
                                                role,
                                            });
                                        }}
                                        trigger={
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-7 h-7 p-0",
                                                    "flex items-center justify-center",
                                                    "rounded-md",
                                                    "text-gray-500",
                                                    "hover:bg-[rgb(var(--color-muted))]",
                                                    "hover:text-gray-800",
                                                    "transition"
                                                )}
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    )
                )
            })}
            <div ref={loadMoreRef} />
            {loadingMore && <p className="text-center py-2 text-sm">Loading...</p>}
        </div>
    );
}