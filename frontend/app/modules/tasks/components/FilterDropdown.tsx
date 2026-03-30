"use client";

import { Dropdown } from "../../group/components/Dropdown";
import { DropdownItemType } from "../../group/types/dropdown-item.type";

type FilterType = "ALL" | "ACTIVE" | "OVERDUE";

const labelMap: Record<FilterType, string> = {
    ALL: "Tất cả",
    ACTIVE: "Còn hạn",
    OVERDUE: "Hết hạn",
};

export const FilterDropdown: React.FC<{
    trigger: React.ReactNode;
    onSelectFilter?: (filter: string) => void;
}> = ({ trigger, onSelectFilter }) => {
    const items: DropdownItemType[] = Object.entries(labelMap).map(
        ([key, label]) => ({
            label,
            onClick: () => onSelectFilter?.(key as FilterType),
        })
    );
    return <Dropdown trigger={trigger} items={items} />;
};