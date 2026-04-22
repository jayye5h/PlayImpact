import Sidebar from '@/components/sidebar'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ScoresPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: scores } = await supabase
    .from('scores')
    .select('id, score, date, created_at')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Sidebar />
      <div className="p-4 sm:p-6 md:ml-64 md:p-8">
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-neon-glow sm:text-4xl">Your Scores</h1>
          <Link
            href="/dashboard/scores/entry"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00D1FF] to-[#0099FF] text-[#0A0A0F] font-bold hover:shadow-[0_0_30px_rgba(0,209,255,0.6)] transition-all"
          >
            + Add Score
          </Link>
        </div>

        <div className="glass rounded-xl p-4 border border-[rgba(255,255,255,0.1)] sm:p-6">
          <p className="text-[#A0A0A8] mb-6">Max 5 scores. Each date must be unique. New entries replace the oldest.</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00D1FF]/20">
                  <th className="text-left py-3 px-3 text-[#A0A0A8] font-semibold">Date</th>
                  <th className="text-left py-3 px-3 text-[#A0A0A8] font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {(scores || []).map((row) => (
                  <tr key={row.id} className="border-b border-[#00D1FF]/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-[#E5E7EB] font-medium">{row.date}</td>
                    <td className="py-3 px-3 text-[#00D1FF] font-bold">{row.score}</td>
                  </tr>
                ))}
                {(!scores || scores.length === 0) && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-[#A0A0A8]">
                      No scores yet. Add your first score to enter the draw.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
