'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Glass Container */}
        <div className="glass rounded-2xl p-6 text-center border-2 border-[#00D1FF] border-opacity-50 hover:border-opacity-100 transition neon-glow sm:p-10 md:p-16">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-6 sm:text-5xl">
            Ready to <span className="text-neon-glow">Play</span>?
          </h2>

          {/* Subheading */}
          <p className="text-lg text-[#A0A0A8] mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of players making a real difference. Every game you play contributes to charities that matter. Your
            skills. Your impact. Your legacy.
          </p>

          {/* CTA Button */}
          <Link
            href="/auth/signup"
            className="group inline-flex w-full items-center justify-center gap-3 px-10 py-5 rounded-lg bg-[#00D1FF] text-[#0A0A0F] font-bold text-lg hover:neon-glow-lg transition transform hover:scale-105 shadow-lg sm:w-auto"
          >
            Join Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>

          {/* Trust Signal */}
          <p className="text-[#A0A0A8] text-sm mt-8">
            🔒 Secure • 🌍 Impact-Verified • ⚡ Instant Rewards
          </p>
        </div>
      </div>
    </section>
  )
}
