import { cn } from "@/app/lib/cn";
import { Button } from "@/app/shared/components/ui";
import { ChevronLeft } from "lucide-react";

interface Props {
    toggle?: () => void;
    className?: string;
}

export default function TaskDrawerTrigger({ toggle, className }: Props) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className={cn(
                "h-8 w-8 p-0 hover:bg-[rgb(var(--color-muted))]",
                className,
            )}
        >
            <ChevronLeft className="w-4 h-4 text-[rgb(var(--color-muted-foreground))]" />
        </Button>
    );
}