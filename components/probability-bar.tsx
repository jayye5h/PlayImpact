'use client'

export default function ProbabilityBar({ probability = 5 }: { probability?: number }) {

  return (
    <div className="glass rounded-xl p-6 border border-[rgba(255,255,255,0.1)] mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#E5E7EB] font-semibold">Winning Chance</h3>
        <span className="text-2xl font-bold text-neon-glow">{probability}%</span>
      </div>

      <div className="relative h-3 bg-[rgba(0,209,255,0.1)] rounded-full overflow-hidden border border-[rgba(0,209,255,0.2)]">
        {/* Neon blue fill */}
        <div
          className="h-full bg-gradient-to-r from-[#00D1FF] to-[#00A8CC] rounded-full transition-all duration-500 neon-glow"
          style={{ width: `${probability}%` }}
        ></div>
      </div>

      <p className="text-xs text-[#A0A0A8] mt-4">Based on your recent performance and activity level</p>
    </div>
  )
}
