'use client'

import { useState } from 'react'

type SpinResult = {
  numbers: number[]
  matches: number
  winnings: number
  date: string
}

interface SlotMachineProps {
  onSpin?: () => Promise<SpinResult>
  onResult?: (result: SpinResult) => void
}

export default function SlotMachine({ onSpin, onResult }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [results, setResults] = useState<number[]>([12, 7, 34, 2, 19])
  const [finalResults, setFinalResults] = useState<number[] | null>(null)
  const [matchCount, setMatchCount] = useState(0)
  const [winnings, setWinnings] = useState(0)
  const winningsMap: { [key: number]: number } = {
    1: 100,
    2: 500,
    3: 5000,
    4: 50000,
    5: 500000,
  }
  const [error, setError] = useState<string | null>(null)

  const randomScore = () => Math.floor(Math.random() * 45) + 1

  const handleSpin = async () => {
    setIsSpinning(true)
    setFinalResults(null)
    setMatchCount(0)
    setWinnings(0)
    setError(null)

    let fetched: SpinResult | null = null
    try {
      fetched = onSpin ? await onSpin() : null
    } catch (e) {
      setIsSpinning(false)
      setError(e instanceof Error ? e.message : 'Failed to run draw')
      return
    }

    const spinDuration = 2000
    const targetNumbers =
      fetched?.numbers?.length === 5 ? fetched.numbers : Array.from({ length: 5 }, () => randomScore())

    for (let i = 0; i < 5; i++) {
      const finalNum = targetNumbers[i]

      await new Promise<void>((resolve) => {
        const startTime = Date.now()
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime
          if (elapsed >= spinDuration) {
            clearInterval(interval)
            setResults((prev) => {
              const next = [...prev]
              next[i] = finalNum
              return next
            })
            resolve()
          } else {
            const randomNum = randomScore()
            setResults((prev) => {
              const next = [...prev]
              next[i] = randomNum
              return next
            })
          }
        }, 50)
      })

      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    const matches = fetched?.matches ?? 0
    const prize = fetched?.winnings ?? winningsMap[matches] ?? 0
    const date = fetched?.date ?? new Date().toLocaleDateString()

    setFinalResults(targetNumbers)
    setMatchCount(matches)
    setWinnings(prize)
    setIsSpinning(false)

    onResult?.({ numbers: targetNumbers, matches, winnings: prize, date })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center gap-2 sm:gap-4">
        {results.map((num, i) => (
          <div
            key={i}
            className={`flex h-16 w-12 items-center justify-center rounded-lg text-2xl font-bold transition-all duration-300 sm:h-20 sm:w-16 sm:text-3xl lg:h-24 lg:w-20 lg:text-4xl ${finalResults && finalResults[i] === num
                ? 'bg-gradient-to-b from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] neon-glow-lg scale-110'
                : 'glass border border-[#00D1FF]/50 text-[#00D1FF]'
              }`}
            style={{
              transform: isSpinning ? `translateY(${Math.random() * 20}px)` : 'translateY(0)',
              transition: 'transform 0.05s ease',
            }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-[#00D1FF] to-[#0099FF] text-[#0A0A0F] font-bold text-lg hover:shadow-[0_0_30px_rgba(0,209,255,0.8)] disabled:opacity-50 transition-all duration-300 neon-glow-lg"
      >
        {isSpinning ? 'Spinning...' : 'Run Draw'}
      </button>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Results */}
      {finalResults && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="glass rounded-xl p-6 border border-[#D4AF37]/50 text-center">
            <div className="text-3xl font-bold text-[#D4AF37] text-gold-glow mb-2 sm:text-5xl lg:text-6xl">
              🎉 {matchCount} Match{matchCount !== 1 ? 'es' : ''}!
            </div>
            {matchCount > 0 && (
              <div className="text-2xl text-[#D4AF37] font-bold sm:text-3xl">
                You won ₹{Math.round(winnings).toLocaleString()}
              </div>
            )}
            {matchCount === 0 && (
              <div className="text-xl text-[#A0A0A8]">Better luck next time!</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
