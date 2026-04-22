'use client'

import { useState } from 'react'

interface PlanCardProps {
  name: string
  price: number
  period: 'monthly' | 'yearly'
  features: string[]
  highlighted?: boolean
  onSelect?: () => void
}

export default function PlanCard({
  name,
  price,
  period,
  features,
  highlighted = false,
  onSelect,
}: PlanCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-left transition-all duration-300 h-full cursor-pointer"
    >
      <div
        className={`glass rounded-2xl p-6 border-2 h-full flex flex-col transition-all duration-300 md:p-8 ${highlighted
            ? 'border-[#D4AF37] neon-glow-lg md:transform md:scale-105 md:shadow-[0_0_50px_rgba(212,175,55,0.6)]'
            : 'border-[#00D1FF]/30 hover:border-[#00D1FF]/60'
          } ${isHovered && !highlighted ? 'shadow-[0_0_30px_rgba(0,209,255,0.5)]' : ''}`}
      >
        {/* Badge */}
        {highlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] text-xs font-bold px-4 py-1 rounded-full">
            RECOMMENDED
          </div>
        )}

        {/* Plan Name */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#E5E7EB] mb-2">{name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-[#D4AF37]">₹{price}</span>
            <span className="text-[#A0A0A8]">/{period === 'monthly' ? 'month' : 'year'}</span>
          </div>
          {period === 'yearly' && (
            <p className="text-sm text-[#D4AF37] mt-2">Save 20% annually</p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 flex-1 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-[#00D1FF]">✓</div>
              <span className="text-[#E5E7EB]">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${highlighted
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] hover:shadow-[0_0_30px_rgba(212,175,55,0.8)]'
              : 'bg-gradient-to-r from-[#00D1FF] to-[#0099FF] text-[#0A0A0F] hover:shadow-[0_0_20px_rgba(0,209,255,0.8)]'
            }`}
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.()
          }}
        >
          Choose Plan
        </button>
      </div>
    </div>
  )
}
