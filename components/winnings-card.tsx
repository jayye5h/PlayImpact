'use client'

export default function WinningsCard({ totalWinnings = 0 }: { totalWinnings?: number }) {
  return (
    <div className="glass rounded-xl p-6 border border-[rgba(255,255,255,0.1)] mb-8 md:p-8">
      <div className="text-center relative">
        {/* Shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-pulse" style={{ animation: 'shine 3s infinite' }}></div>
        </div>

        <p className="text-[#A0A0A8] text-sm mb-2 uppercase tracking-widest">Total Winnings</p>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFE66D] bg-clip-text text-transparent mb-4 sm:text-4xl lg:text-5xl">
          ₹ {Math.round(totalWinnings).toLocaleString()}
        </h2>
        <p className="text-sm text-[#A0A0A8]">Keep playing to increase your winnings</p>
      </div>
    </div>
  )
}
