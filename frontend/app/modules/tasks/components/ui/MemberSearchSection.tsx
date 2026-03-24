import { Input } from "@/app/shared/components/ui";
import { Search } from "lucide-react";

export default function MemberSearchSection() {
    return (
        <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input placeholder="Tìm tên thành viên..." className="pl-9" />
        </div>
    );
}