'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import SlotMachine from '@/components/slot-machine'
import { revealLatestDrawForUserAction } from '@/app/dashboard/actions'

export default function DrawPage() {
  const [history, setHistory] = useState<Array<{ matches: number; winnings: number; date: string }>>([])

  const handleDrawResult = (result: { matches: number; winnings: number; date: string }) => {
    const newEntry = { matches: result.matches, winnings: result.winnings, date: result.date }
    setHistory((prev) => [newEntry, ...prev])
  }

  const handleSpin = async () => {
    const res = await revealLatestDrawForUserAction()
    if (!res.ok) {
      throw new Error(res.error)
    }
    return {
      numbers: res.data.numbers,
      matches: res.data.matches,
      winnings: res.data.winnings,
      date: res.data.drawDate,
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1033] md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Monthly Draw</h1>
            <p className="text-[#A0A0A8]">Spin the drums and test your luck!</p>
          </div>

          {/* Glass Card */}
          <div className="glass rounded-2xl p-4 border border-[#00D1FF]/30 mb-8 sm:p-6 md:p-8">
            <SlotMachine onSpin={handleSpin} onResult={handleDrawResult} />
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">Draw History</h2>
              <div className="space-y-3">
                {history.map((entry, i) => (
                  <div
                    key={i}
                    className="glass rounded-lg p-4 border border-[#00D1FF]/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="text-[#E5E7EB] font-semibold">
                        {entry.matches} Match{entry.matches !== 1 ? 'es' : ''}
                      </div>
                      <div className="text-sm text-[#A0A0A8]">{entry.date}</div>
                    </div>
                    <div className="text-2xl font-bold text-[#D4AF37]">
                      ₹{entry.winnings}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
