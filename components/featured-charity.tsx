'use client'

import { Heart, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedCharity() {
  return (
    <section id="charities" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-5xl">
            Featured <span className="text-neon-glow">Charity</span>
          </h2>
          <p className="text-xl text-[#A0A0A8]">Support causes you care about</p>
        </div>

        {/* Charity Card */}
        <div className="glass rounded-2xl overflow-hidden border border-[#00D1FF] border-opacity-30 hover:border-opacity-100 transition">
          <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-8 md:p-12">
            {/* Image Side */}
            <div className="relative h-64 rounded-xl overflow-hidden sm:h-80 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF] to-[#0A3A5C] flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-24 h-24 text-[#D4AF37] mx-auto mb-4 opacity-70" />
                  <p className="text-white text-lg font-semibold">Save Water Initiative</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-between py-4">
              {/* Title & Description */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 sm:text-3xl">Save Water Initiative</h3>
                <p className="text-[#A0A0A8] text-base leading-relaxed mb-6 sm:text-lg">
                  Providing clean drinking water access to rural communities across India. We build sustainable water systems
                  that serve thousands of families daily.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#00D1FF]" />
                    <p className="text-[#A0A0A8] text-sm">Lives Impacted</p>
                  </div>
                  <p className="text-xl font-bold text-white sm:text-2xl">10,000+</p>
                </div>

                <div className="glass rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                    <p className="text-[#A0A0A8] text-sm">Funds Raised</p>
                  </div>
                  <p className="text-2xl font-bold text-[#D4AF37]">₹45,000</p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/auth/signup"
                className="px-8 py-4 rounded-lg bg-[#D4AF37] text-[#0A0A0F] font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37] transition transform hover:scale-105 w-full md:w-auto inline-block text-center"
              >
                Support Now
              </Link>
            </div>
          </div>
        </div>

        {/* More Charities Link */}
        <div className="text-center mt-12">
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-lg border-2 border-[#00D1FF] text-[#00D1FF] font-bold hover:bg-[#00D1FF] hover:text-[#0A0A0F] transition inline-block"
          >
            Explore All Charities →
          </Link>
        </div>
      </div>
    </section>
  )
}
