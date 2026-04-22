import AdminSidebar from '@/components/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1033] md:flex-row">
      <AdminSidebar />
      {children}
    </div>
  )
}
