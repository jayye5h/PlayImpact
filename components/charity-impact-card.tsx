'use client'

export default function CharityImpactCard({
  contributedAmount = 0,
  charitiesSupported = 0,
}: {
  contributedAmount?: number
  charitiesSupported?: number
}) {

  return (
    <div className="glass rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#A0A0A8] text-sm mb-2 uppercase tracking-widest">Charity Impact</p>
          <h3 className="text-3xl font-bold text-[#E5E7EB]">
            ₹{Math.round(contributedAmount).toLocaleString()} <span className="text-red-500 ml-2">❤️</span>
          </h3>
          <p className="text-xs text-[#A0A0A8] mt-2">You&apos;ve made a real difference</p>
        </div>

        {/* Subtle green glow accent */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-transparent opacity-10 blur-lg rounded-lg"></div>
          <div className="relative px-6 py-4 rounded-lg border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)]">
            <p className="text-sm text-[#10B981] font-semibold">{charitiesSupported} Charit{charitiesSupported === 1 ? 'y' : 'ies'}</p>
            <p className="text-xs text-[#10B981] opacity-70">Supported</p>
          </div>
        </div>
      </div>
    </div>
  )
}
