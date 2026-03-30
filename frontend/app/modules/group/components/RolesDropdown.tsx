"use client";

import { Dropdown } from "./Dropdown";
import { DropdownItemType } from "../types/dropdown-item.type";

export const RolesDropdown: React.FC<{
    trigger: React.ReactNode;
    roles?: string[];
    onSelectRole?: (role: string) => void;
}> = ({ trigger, roles, onSelectRole }) => {
    const items: DropdownItemType[] = [
        {
            label: "Phân quyền",
            subMenuPosition: "left",
            subMenu:
                roles?.map((role) => ({
                    label: role,
                    onClick: () => onSelectRole?.(role)
                })) ?? [],
        },
    ];

    return <Dropdown trigger={trigger} items={items} />;
};