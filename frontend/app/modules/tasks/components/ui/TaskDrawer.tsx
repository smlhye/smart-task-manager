import MembersSection from "./MemberSection";
import StatsSection from "./StatsSection";
import TaskDrawerTrigger from "./TaskDrawerTrigger";

interface Props {
    onOpenModal?: () => void;
    toggle?: () => void;
    groupId: number;
}

export default function TaskDrawer({ groupId, toggle, onOpenModal }: Props) {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="relative flex items-center justify-center mx-3 py-3 border-b border-[rgb(var(--color-border))]">
                <h2 className="text-sm font-semibold tracking-tight">
                    Thông tin chi tiết nhóm
                </h2>

                <TaskDrawerTrigger
                    toggle={toggle}
                    className="absolute left-0 rotate-180"
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <StatsSection />
                <MembersSection onOpenModal={onOpenModal} groupId={groupId}/>
            </div>
        </div>
    );
}