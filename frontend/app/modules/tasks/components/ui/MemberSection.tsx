import MemberListSection from "./MemberListSection";
import MemberSearchSection from "./MemberSearchSection";

export default function MembersSection() {
    return (
        <div className="space-y-2">
            <h3 className="text-xs font-medium text-[rgb(var(--color-muted-foreground))] uppercase">
                Thành viên
            </h3>
            <MemberSearchSection />
            <MemberListSection />
        </div>
    )
}