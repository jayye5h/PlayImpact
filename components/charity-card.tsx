'use client'

import { useState } from 'react'

interface CharityCardProps {
  id: string
  name: string
  description: string
  raised: number
  image: string
  selected?: boolean
  onSelect?: (id: string) => void
}

export default function CharityCard({
  id,
  name,
  description,
  raised,
  image,
  selected = false,
  onSelect,
}: CharityCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(id)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group text-left transition-all duration-300 cursor-pointer ${isHovered && !selected ? 'transform -translate-y-2' : ''
        }`}
    >
      <div
        className={`glass rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selected
            ? 'border-[#D4AF37] neon-glow-lg'
            : 'border-[#00D1FF]/30 hover:border-[#00D1FF]/60 hover:shadow-[0_0_30px_rgba(0,209,255,0.5)]'
          }`}
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-[#00D1FF]/20 to-[#D4AF37]/20 overflow-hidden">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'
              }`}
          />
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]/40 backdrop-blur-sm">
              <div className="text-4xl text-[#D4AF37]">✓</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#E5E7EB] mb-2">{name}</h3>
          <p className="text-sm text-[#A0A0A8] mb-4 line-clamp-2">{description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-[#00D1FF]/20">
            <span className="text-sm text-[#A0A0A8]">Raised</span>
            <span className="text-lg font-bold text-[#D4AF37]">₹{raised.toLocaleString()}</span>
          </div>
        </div>

        {/* Select Button */}
        {!selected && (
          <div className="px-6 pb-6">
            <button
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#00D1FF] to-[#0099FF] text-[#0A0A0F] font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,209,255,0.8)] transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(id)
              }}
            >
              Select Charity
            </button>
          </div>
        )}

        {selected && (
          <div className="px-6 pb-6">
            <div className="w-full py-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-semibold text-sm text-center">
              Selected
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
