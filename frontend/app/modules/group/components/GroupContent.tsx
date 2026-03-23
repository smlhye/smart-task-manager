import { decodeId } from "@/app/shared/utils/hashid";

const groupData = [
    { id: 1, name: "Backend Engineers", description: "Chịu trách nhiệm backend, API, database." },
    { id: 2, name: "Frontend Wizards", description: "Chịu trách nhiệm giao diện, React/Next.js." },
    { id: 3, name: "UI/UX Designers", description: "Chịu trách nhiệm thiết kế, prototype." },
    { id: 4, name: "QA Specialists", description: "Chịu trách nhiệm test, quality assurance." },
    { id: 5, name: "DevOps Crew", description: "Chịu trách nhiệm deployment, CI/CD." },
    { id: 6, name: "iOS Developers", description: "Chịu trách nhiệm phát triển ứng dụng iOS." },
    { id: 7, name: "Android Developers", description: "Chịu trách nhiệm phát triển ứng dụng Android." },
    { id: 8, name: "Data Scientists", description: "Chịu trách nhiệm phân tích dữ liệu, ML/AI." },
    { id: 9, name: "Security Analysts", description: "Chịu trách nhiệm bảo mật hệ thống, kiểm thử bảo mật." },
    { id: 10, name: "Product Managers", description: "Chịu trách nhiệm roadmap, tính năng sản phẩm." },
    { id: 11, name: "Customer Success", description: "Chịu trách nhiệm hỗ trợ khách hàng, ticket system." },
    { id: 12, name: "Sales Team", description: "Chịu trách nhiệm bán hàng, follow-up khách hàng." },
    { id: 13, name: "Marketing Squad", description: "Chịu trách nhiệm quảng cáo, social media, SEO." },
    { id: 14, name: "Content Creators", description: "Chịu trách nhiệm viết nội dung, blog, bài PR." },
    { id: 15, name: "HR Partners", description: "Chịu trách nhiệm tuyển dụng, quản lý nhân sự." },
    { id: 16, name: "Finance Officers", description: "Chịu trách nhiệm kế toán, báo cáo tài chính." },
    { id: 17, name: "Legal Advisors", description: "Chịu trách nhiệm pháp lý, hợp đồng, compliance." },
    { id: 18, name: "Training Experts", description: "Chịu trách nhiệm đào tạo nhân sự, workshop." },
    { id: 19, name: "R&D Innovators", description: "Chịu trách nhiệm nghiên cứu và phát triển sản phẩm mới." },
    { id: 20, name: "IT Support Team", description: "Chịu trách nhiệm hỗ trợ IT nội bộ, phần cứng & phần mềm." },
];

interface GroupContentProps {
    id: string;
}

export default function GroupContent({ id }: GroupContentProps) {
    console.log(id);
    if (!id) return <p className="text-red-500">Group ID is missing</p>;

    const decodedId = decodeId(id);
    console.log(decodedId);
    if (decodedId === null) return <p className="text-red-500">Invalid group ID</p>;

    const group = groupData.find((g) => g.id === decodedId);
    if (!group) return <p className="text-red-500">Group not found</p>;

    return (
        <div className="border p-2 rounded-md animate-fade-in">
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="mt-2">{group.description}</p>
        </div>
    );
}