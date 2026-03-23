import { encodeId } from "@/app/shared/utils/hashid";
import { Button, Input } from "@/app/shared/components/ui";
import GroupListWrapper from "./GroupListWrapper";
import { Plus, Search } from "lucide-react";
import { GroupSchemaType } from "../schemas/group.schema";

type Props = {
    groups: GroupSchemaType[],
    onOpenModal: () => void,
    loadMore: () => void,
    hasMore?: boolean;
    loadingMore: boolean,
    onSearch: (value: string) => void;
}

export default function GroupListSever({
    groups,
    onOpenModal,
    loadMore,
    hasMore,
    loadingMore,
    onSearch
}: Props) {
    const groupsWithHash = groups.map((g) => ({
        ...g,
        hash: encodeId(g.id),
    }));

    return (
        <div className="flex flex-col gap-3 h-full">
            <div className="flex gap-1">
                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input placeholder="Tìm tên nhóm..." className="pl-9" onChange={(e) => onSearch(e.target.value)}/>
                </div>

                <Button variant="outline" onClick={onOpenModal}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <GroupListWrapper
                groups={groupsWithHash}
                loadMore={loadMore}
                loadingMore={loadingMore}
                hasMore={hasMore}
            />
        </div>
    );
}