'use client'

import { useState } from 'react'
import { adminSetWinnerStatusAction } from '@/app/admin/actions'

export type AdminWinnerRow = {
  id: string
  prize: number
  proof_url: string | null
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  match_count: number
  created_at: string
  users?: { name: string | null; email: string } | null
  draws?: { draw_date: string } | null
}

export default function WinnersVerification({ winners: initialWinners = [] }: { winners?: AdminWinnerRow[] }) {
  const [winners, setWinners] = useState<AdminWinnerRow[]>(initialWinners)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const setStatus = async (id: string, status: AdminWinnerRow['status']) => {
    setError(null)
    const res = await adminSetWinnerStatusAction(id, status)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setWinners((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)))
  }

  const toggleExpand = async (winner: AdminWinnerRow) => {
    const next = expandedId === winner.id ? null : winner.id
    setExpandedId(next)
    setError(null)

    if (next && winner.proof_url && !proofUrls[winner.id]) {
      const res = await fetch(`/api/winners/proof-url?winnerId=${winner.id}`)
      const json = (await res.json()) as any
      if (res.ok && json?.ok && json.data?.signedUrl) {
        setProofUrls((prev) => ({ ...prev, [winner.id]: json.data.signedUrl }))
      } else {
        setError(json?.error || 'Failed to load proof')
      }
    }
  }

  return (
    <div className="glass rounded-2xl p-4 border border-[#00D1FF]/30 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">Winner Verification</h2>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {winners.map((winner) => (
          <div
            key={winner.id}
            className="border border-[#00D1FF]/30 rounded-xl p-4 hover:bg-white/5 transition-all sm:p-6"
          >
            <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#E5E7EB] mb-1">{winner.users?.name || winner.users?.email || 'Unknown user'}</h3>
                <p className="text-[#A0A0A8] text-sm mb-2">Prize: ₹{Math.round(winner.prize || 0).toLocaleString()}</p>
                <p className="text-[#A0A0A8] text-xs">
                  Date: {winner.draws?.draw_date || winner.created_at.slice(0, 10)} · Matches: {winner.match_count}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-semibold ${winner.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400'
                : winner.status === 'approved'
                  ? 'bg-green-500/20 text-green-400'
                  : winner.status === 'paid'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                {winner.status}
              </span>
            </div>

            {/* Expandable Proof Section */}
            <button
              onClick={() => toggleExpand(winner)}
              className="w-full text-left text-[#00D1FF] text-sm font-semibold hover:text-[#00D1FF]/80 transition-all mb-4"
            >
              {expandedId === winner.id ? '▼ Hide Proof' : '▶ View Proof'}
            </button>

            {expandedId === winner.id && (
              <div className="mb-4 pb-4 border-b border-[#00D1FF]/30">
                <div className="bg-[#1A1033]/60 rounded-lg p-4 mb-4 border border-[#00D1FF]/30">
                  <p className="text-[#A0A0A8] text-sm mb-2">Proof</p>
                  {winner.proof_url ? (
                    proofUrls[winner.id] ? (
                      <img
                        src={proofUrls[winner.id]}
                        alt="Proof"
                        className="w-full max-h-80 object-contain rounded-lg border border-[#00D1FF]/30"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-[#00D1FF]/20 to-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                        <p className="text-[#A0A0A8] text-sm">Loading proof…</p>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-[#00D1FF]/20 to-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                      <p className="text-[#A0A0A8] text-sm">No proof uploaded</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {winner.status === 'pending' && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setStatus(winner.id, 'approved')}
                      className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500 text-green-400 font-semibold hover:bg-green-500/30 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setStatus(winner.id, 'rejected')}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500 text-red-400 font-semibold hover:bg-red-500/30 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {winner.status === 'approved' && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setStatus(winner.id, 'paid')}
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500 text-blue-300 font-semibold hover:bg-blue-500/30 transition-all"
                    >
                      Mark Paid
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {winners.length === 0 && (
          <div className="rounded-xl border border-[#00D1FF]/30 p-6 text-center text-[#A0A0A8] md:p-8">
            No winner claims found.
          </div>
        )}
      </div>
    </div>
  )
}
