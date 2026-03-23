import GroupLayout from "@/app/modules/group/layout/group"

type LayoutProps = {
    children: React.ReactNode,
}
export default function Layout({ children }: LayoutProps) {
    return (
        <GroupLayout>{children}</GroupLayout>
    )
}