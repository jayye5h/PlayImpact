import Sidebar from '@/components/sidebar'
import WelcomeMessage from '@/components/welcome-message'
import SubscriptionCard from '@/components/subscription-card'
import WinningsCard from '@/components/winnings-card'
import ScoreBubbles from '@/components/score-bubbles'
import ProbabilityBar from '@/components/probability-bar'
import CharityImpactCard from '@/components/charity-impact-card'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { estimateWinningProbability } from '@/lib/domain/draw'
import { isPlanType, planLabel } from '@/lib/domain/plans'

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('name, plan_type, expiry_date, charity_id, charity_percentage')
    .eq('id', user.id)
    .maybeSingle()

  const { data: scoreRows } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(5)

  const scores = (scoreRows || []).map((s) => s.score)

  const { data: winnerRows } = await supabase
    .from('winners')
    .select('prize, status')
    .eq('user_id', user.id)
    .neq('status', 'rejected')

  const totalWinnings = (winnerRows || []).reduce((sum, w) => sum + Number(w.prize || 0), 0)
  const pct = typeof profile?.charity_percentage === 'number' ? profile.charity_percentage : 0
  const contributedAmount = (totalWinnings * pct) / 100
  const charitiesSupported = profile?.charity_id ? 1 : 0

  const probability = estimateWinningProbability(scores)

  const plan = profile?.plan_type || ''
  const planText = isPlanType(plan) ? planLabel(plan) : 'No Subscription'

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Sidebar />

      {/* Main content */}
      <div className="p-4 sm:p-6 md:ml-64 md:p-8">
        <WelcomeMessage userName={profile?.name || user.user_metadata?.name || user.email} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <SubscriptionCard planLabel={planText} renewsOn={profile?.expiry_date || null} manageHref="/dashboard/profile" />
          <WinningsCard totalWinnings={totalWinnings} />
        </div>

        {/* Score Bubbles */}
        <div>
          <h2 className="text-xl font-semibold text-[#E5E7EB] mb-6">Your Recent Scores</h2>
          <ScoreBubbles scores={scores} />
        </div>

        {/* Probability and Charity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProbabilityBar probability={probability} />
          <CharityImpactCard contributedAmount={contributedAmount} charitiesSupported={charitiesSupported} />
        </div>
      </div>
    </div>
  )
}
