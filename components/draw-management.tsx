'use client'

import { useState } from 'react'
import { adminPublishDrawAction, adminSimulateDrawAction } from '@/app/dashboard/actions'

export default function DrawManagement() {
  const [mode, setMode] = useState<'random' | 'algorithm'>('random')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<{
    winners: number
    totalPrize: number
    timestamp: string
    numbers?: number[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRunSimulation = async () => {
    setRunning(true)
    setError(null)

    const res = await adminSimulateDrawAction(mode)
    if (!res.ok) {
      setError('Simulation failed')
      setRunning(false)
      return
    }

    setResults({
      winners: res.data.winners ?? 0,
      totalPrize: res.data.totalPrize ?? 0,
      timestamp: res.data.timestamp,
      numbers: res.data.numbers,
    })
    setRunning(false)
  }

  const handlePublish = async () => {
    setRunning(true)
    setError(null)

    const res = await adminPublishDrawAction(mode)
    if (!res.ok) {
      setError(res.error)
      setRunning(false)
      return
    }

    setResults({
      winners: res.data.winners,
      totalPrize: res.data.totalPrize,
      timestamp: res.data.drawDate,
      numbers: res.data.numbers,
    })

    setRunning(false)
  }

  return (
    <div className="glass rounded-2xl p-4 border border-[#00D1FF]/30 space-y-6 sm:p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Draw Management</h2>
        <p className="text-[#A0A0A8] mb-6">Configure and run monthly draws</p>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
          <button
            onClick={() => setMode('random')}
            className={`p-4 rounded-lg border-2 transition-all ${mode === 'random'
              ? 'border-[#00D1FF] bg-[#00D1FF]/10 text-[#00D1FF]'
              : 'border-[#00D1FF]/30 text-[#A0A0A8] hover:text-[#E5E7EB]'
              }`}
          >
            <div className="font-semibold mb-1">Random Mode</div>
            <div className="text-xs opacity-75">Equal probability</div>
          </button>
          <button
            onClick={() => setMode('algorithm')}
            className={`p-4 rounded-lg border-2 transition-all ${mode === 'algorithm'
              ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
              : 'border-[#D4AF37]/30 text-[#A0A0A8] hover:text-[#E5E7EB]'
              }`}
          >
            <div className="font-semibold mb-1">Algorithm Mode</div>
            <div className="text-xs opacity-75">Score-weighted</div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={handleRunSimulation}
            disabled={running}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00D1FF] to-[#00B8D4] text-[#0A0A0F] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,209,255,0.6)] transition-all"
          >
            {running ? 'Running Simulation...' : 'Run Simulation'}
          </button>
          <button
            onClick={handlePublish}
            disabled={running}
            className="flex-1 px-6 py-3 rounded-lg border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37]/10 transition-all disabled:opacity-50"
          >
            Publish Draw
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Simulation Results */}
      {results && (
        <div className="mt-6 pt-6 border-t border-[#00D1FF]/30">
          <h3 className="text-lg font-bold text-[#00D1FF] mb-4">Last Simulation Results</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-[#00D1FF]/10 rounded-lg p-4">
              <p className="text-[#A0A0A8] text-sm mb-1">Winners</p>
              <p className="text-2xl font-bold text-[#00D1FF]">{results.winners}</p>
            </div>
            <div className="bg-[#D4AF37]/10 rounded-lg p-4">
              <p className="text-[#A0A0A8] text-sm mb-1">Total Prize</p>
              <p className="text-2xl font-bold text-[#D4AF37]">₹{results.totalPrize.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 sm:col-span-2">
              <p className="text-[#A0A0A8] text-sm mb-1">Run Date</p>
              <p className="text-[#E5E7EB] font-semibold">{results.timestamp}</p>
            </div>
            {results.numbers && (
              <div className="bg-white/5 rounded-lg p-4 sm:col-span-2">
                <p className="text-[#A0A0A8] text-sm mb-1">Numbers</p>
                <p className="text-[#E5E7EB] font-semibold">{results.numbers.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
