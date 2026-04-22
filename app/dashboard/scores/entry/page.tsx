'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import ScoreSlider from '@/components/score-slider'
import { addScoreAction } from '@/app/dashboard/actions'
import { useRouter } from 'next/navigation'

export default function ScoreEntryPage() {
  const [score, setScore] = useState(23)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const res = await addScoreAction(score, date)
    setLoading(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    router.push('/dashboard/scores')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1033] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Add New Score</h1>
            <p className="text-[#A0A0A8]">Enter your gaming score to participate in the draw</p>
          </div>

          {/* Glass Card */}
          <div className="glass rounded-2xl p-4 border border-[#00D1FF]/30 sm:p-6 md:p-8">
            <div className="space-y-8">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              {/* Score Slider */}
              <div>
                <label className="block text-lg font-semibold text-[#E5E7EB] mb-6">
                  Your Score (1-45)
                </label>
                <ScoreSlider value={score} onChange={setScore} />
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-lg font-semibold text-[#E5E7EB] mb-3">
                  Date Achieved
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#1A1033]/60 border border-[#00D1FF]/50 text-[#E5E7EB] focus:outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/30 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#00D1FF] to-[#0099FF] text-[#0A0A0F] font-bold text-lg hover:shadow-[0_0_30px_rgba(0,209,255,0.8)] disabled:opacity-50 transition-all duration-300 neon-glow-lg"
              >
                {loading ? 'Submitting...' : 'Submit Score'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
