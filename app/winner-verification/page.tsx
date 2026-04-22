import { redirect } from 'next/navigation'

import Sidebar from '@/components/sidebar'
import ProofUpload from '@/components/proof-upload'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function WinnerVerificationPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=/winner-verification')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('charity_percentage, charities(name)')
    .eq('id', user.id)
    .single()

  const charityName = (profile as any)?.charities?.name as string | undefined
  const charityPct = (profile as any)?.charity_percentage as number | null

  const { data: winners } = await supabase
    .from('winners')
    .select('id, prize, match_count, status, proof_url, created_at, draws(draw_date)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const claimables = (winners || []).filter((w: any) => w.status !== 'paid')

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1033] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Verify Your Win</h1>
            <p className="text-[#A0A0A8]">Upload proof of your winning score to claim your prize</p>
          </div>

          {/* Prize Info */}
          <div className="glass rounded-2xl p-6 border border-[#D4AF37]/50 mb-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-[#A0A0A8] text-sm mb-1">Selected Charity</p>
                <p className="text-[#E5E7EB] font-semibold">{charityName || 'Not selected'}</p>
                <p className="text-[#A0A0A8] text-xs mt-1">Contribution: {typeof charityPct === 'number' ? `${charityPct}%` : '—'}</p>
              </div>
              <div>
                <p className="text-[#A0A0A8] text-sm mb-1">Claimable Wins</p>
                <p className="text-3xl font-bold text-[#D4AF37]">{claimables.length}</p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          {claimables.length === 0 ? (
            <div className="glass rounded-2xl p-6 border border-[#00D1FF]/30 text-center text-[#A0A0A8] md:p-8">
              No wins to verify yet.
            </div>
          ) : (
            <div className="space-y-6">
              {claimables.map((w: any) => (
                <div key={w.id} className="glass rounded-2xl p-6 border border-[#00D1FF]/30">
                  <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <p className="text-[#A0A0A8] text-sm mb-1">Prize Amount</p>
                      <p className="text-3xl font-bold text-[#D4AF37]">₹{Math.round(w.prize || 0).toLocaleString()}</p>
                      <p className="text-[#A0A0A8] text-xs mt-2">
                        Draw date: {w.draws?.draw_date || w.created_at?.slice(0, 10)} · Matches: {w.match_count}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold ${w.status === 'approved'
                      ? 'bg-green-500/20 text-green-400'
                      : w.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {(w.status || 'pending').toString()}
                    </span>
                  </div>

                  <ProofUpload winnerId={w.id} disabled={w.status === 'approved'} />
                </div>
              ))}
            </div>
          )}

          {/* Requirements */}
          <div className="mt-12 glass rounded-2xl p-6 border border-[#00D1FF]/30">
            <h3 className="text-lg font-bold text-[#E5E7EB] mb-4">Proof Requirements</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-[#A0A0A8]">
                <span className="text-[#00D1FF]">✓</span>
                <span>Clear screenshot showing your winning score</span>
              </li>
              <li className="flex gap-3 text-[#A0A0A8]">
                <span className="text-[#00D1FF]">✓</span>
                <span>Game name and date visible in the screenshot</span>
              </li>
              <li className="flex gap-3 text-[#A0A0A8]">
                <span className="text-[#00D1FF]">✓</span>
                <span>No edited or altered images</span>
              </li>
              <li className="flex gap-3 text-[#A0A0A8]">
                <span className="text-[#00D1FF]">✓</span>
                <span>Valid image format (JPG, PNG, GIF)</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
