import UsersTable from '@/components/users-table'
import { requireAdmin } from '@/lib/auth/admin'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export default async function UsersPage() {
  await requireAdmin()
  const admin = createSupabaseAdminClient()

  const { data: users } = await admin
    .from('users')
    .select('id, name, email, plan_type, is_active, expiry_date, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Users</h1>
          <p className="text-[#A0A0A8]">Manage and monitor user accounts</p>
        </div>

        <UsersTable users={(users || []) as any} />
      </div>
    </main>
  )
}
