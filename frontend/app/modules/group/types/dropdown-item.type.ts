export type Variant = "default" | "danger";

export type DropdownItemType = {
    label?: string;
    onClick?: () => void;
    variant?: Variant;
    icon?: React.ElementType;
    divider?: boolean;

    subMenu?: DropdownItemType[];
    subMenuPosition?: "left" | "right";

    closeOnClick?: boolean;
};