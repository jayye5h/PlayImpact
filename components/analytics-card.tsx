'use client'

interface AnalyticsCardProps {
  label: string
  value: string | number
  trend?: number
  icon: string
}

export default function AnalyticsCard({ label, value, trend, icon }: AnalyticsCardProps) {
  return (
    <div className="glass rounded-2xl p-6 border border-[#00D1FF]/30 hover:border-[#00D1FF]/60 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[#A0A0A8] text-sm mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-[#E5E7EB]">{value}</h3>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
      {trend !== undefined && (
        <p className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last month
        </p>
      )}
    </div>
  )
}
