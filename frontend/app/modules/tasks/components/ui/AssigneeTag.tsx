import { X } from "lucide-react";

type AssigneeTagProps = {
    label: string;
    onRemove: () => void;
}

export const AssigneeTag = ({ label, onRemove }: AssigneeTagProps) => {
    return (
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            <span>{label}</span>
            <button
                type="button"
                onClick={onRemove}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
}