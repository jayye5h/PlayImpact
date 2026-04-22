import DrawManagement from '@/components/draw-management'
import { requireAdmin } from '@/lib/auth/admin'

export default async function DrawPage() {
  await requireAdmin()
  return (
    <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Draw Management</h1>
          <p className="text-[#A0A0A8]">Configure and run monthly draws</p>
        </div>

        <DrawManagement />
      </div>
    </main>
  )
}
