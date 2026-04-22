'use client'

export default function WelcomeMessage({ userName }: { userName?: string | null }) {
  const resolvedName = userName || 'Player'
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">
        {greeting}, <span className="text-neon-glow">{resolvedName}</span> 👋
      </h1>
      <p className="text-[#A0A0A8]">Welcome back to your gaming hub. Time to earn and make an impact!</p>
    </div>
  )
}
