import WinnersVerification from '@/components/winners-verification'
import { requireAdmin } from '@/lib/auth/admin'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export default async function WinnersPage() {
  await requireAdmin()
  const admin = createSupabaseAdminClient()
  const { data: winners } = await admin
    .from('winners')
    .select('id, prize, proof_url, status, match_count, created_at, users(name,email), draws(draw_date)')
    .order('created_at', { ascending: false })

  return (
    <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Winners</h1>
          <p className="text-[#A0A0A8]">Verify and approve winner claims</p>
        </div>

        <WinnersVerification winners={(winners || []) as any} />
      </div>
    </main>
  )
}
