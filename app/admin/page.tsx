import AnalyticsCard from '@/components/analytics-card'
import DrawManagement from '@/components/draw-management'
import { requireAdmin } from '@/lib/auth/admin'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isPlanType, planPriceInr } from '@/lib/domain/plans'

function formatInrCompact(amount: number) {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(1)}Cr`
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(1)}L`
  return `₹${Math.round(amount).toLocaleString()}`
}

export default async function AdminOverview() {
  await requireAdmin()
  const admin = createSupabaseAdminClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstOfMonthIso = firstOfMonth.toISOString()

  const [{ count: totalUsers }, { data: charityRows }, { count: winnersThisMonth }, { data: activeRows }] =
    await Promise.all([
      admin.from('users').select('id', { count: 'exact', head: true }),
      admin.from('charities').select('total_raised'),
      admin
        .from('winners')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', firstOfMonthIso),
      admin
        .from('users')
        .select('plan_type, is_active, expiry_date')
        .eq('is_active', true),
    ])

  const charityDonations = (charityRows || []).reduce(
    (sum: number, c: any) => sum + Number(c.total_raised || 0),
    0,
  )

  const today = new Date()
  const prizePool = (activeRows || []).reduce((sum: number, u: any) => {
    const plan = u.plan_type
    if (!isPlanType(plan)) return sum
    if (!u.expiry_date) return sum
    const expiry = new Date(u.expiry_date)
    if (expiry < today) return sum
    return sum + planPriceInr(plan)
  }, 0)

  return (
    <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Dashboard</h1>
          <p className="text-[#A0A0A8]">Platform overview and key metrics</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsCard
            icon="👥"
            label="Total Users"
            value={(totalUsers || 0).toLocaleString()}
          />
          <AnalyticsCard
            icon="💰"
            label="Prize Pool"
            value={formatInrCompact(prizePool)}
          />
          <AnalyticsCard
            icon="❤️"
            label="Charity Donations"
            value={formatInrCompact(charityDonations)}
          />
          <AnalyticsCard
            icon="🏆"
            label="Winners This Month"
            value={(winnersThisMonth || 0).toLocaleString()}
          />
        </div>

        {/* Draw Management */}
        <DrawManagement />
      </div>
    </main>
  )
}
