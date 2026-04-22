import CharityAdmin from '@/components/charity-admin'
import { requireAdmin } from '@/lib/auth/admin'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export default async function CharitiesPage() {
  await requireAdmin()
  const admin = createSupabaseAdminClient()
  const { data: charities } = await admin
    .from('charities')
    .select('id, name, description, total_raised, image_url')
    .order('created_at', { ascending: false })

  const initial = (charities || []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    raised: Number(c.total_raised || 0),
    image_url: c.image_url,
  }))

  return (
    <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Charity Management</h1>
          <p className="text-[#A0A0A8]">Add, edit, and manage charity partners</p>
        </div>

        <CharityAdmin initialCharities={initial as any} />
      </div>
    </main>
  )
}
