'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{ id: number; left: number; top: number }>>([])

  useEffect(() => {
    // Generate floating numbers
    const numbers = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }))
    setFloatingNumbers(numbers)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1033] to-[#0A0A0F]" />

      {/* Floating numbers background effect */}
      {floatingNumbers.map((num) => (
        <div
          key={num.id}
          className="absolute text-[#00D1FF] text-2xl font-bold opacity-20 float pointer-events-none sm:text-4xl"
          style={{
            left: `${num.left}%`,
            top: `${num.top}%`,
          }}
        >
          {Math.floor(Math.random() * 100)}
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-4xl font-bold text-white mb-6 text-pretty sm:text-6xl lg:text-7xl">
          Turn Your <span className="text-neon-glow">Game Into</span> Impact
        </h1>

        {/* Subheading */}
        <p className="text-xl text-[#E5E7EB] mb-10 font-light sm:text-3xl sm:mb-12">
          Play. Win. Give.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Primary CTA */}
          <Link
            href="/auth/signup"
            className="w-full px-8 py-4 rounded-lg bg-[#00D1FF] text-[#0A0A0F] font-bold text-lg hover:neon-glow-lg transition transform hover:scale-105 shadow-lg sm:w-auto"
          >
            Start Playing
          </Link>

          {/* Secondary CTA */}
          <Link
            href="#charities"
            className="w-full px-8 py-4 rounded-lg border-2 border-[#D4AF37] text-[#D4AF37] font-bold text-lg hover:gold-glow transition transform hover:scale-105 sm:w-auto"
          >
            Explore Charities
          </Link>
        </div>
      </div>

      {/* Glow elements */}
      <div className="absolute bottom-0 left-1/4 h-48 w-48 bg-[#00D1FF] opacity-5 rounded-full blur-3xl pointer-events-none sm:h-96 sm:w-96" />
      <div className="absolute top-1/4 right-1/4 h-48 w-48 bg-[#D4AF37] opacity-5 rounded-full blur-3xl pointer-events-none sm:h-96 sm:w-96" />
    </section>
  )
}
