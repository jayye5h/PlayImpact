'use client'

import { useEffect, useState } from 'react'
import { Zap, Heart, Target } from 'lucide-react'

export default function LiveActivity() {
  const activities = [
    { icon: Heart, text: 'Arjun won ₹1200', color: 'text-red-400' },
    { icon: Zap, text: '₹500 donated to Save Water Initiative', color: 'text-[#00D1FF]' },
    { icon: Target, text: 'Score added: 28 points', color: 'text-[#D4AF37]' },
    { icon: Heart, text: 'Priya won ₹800', color: 'text-red-400' },
    { icon: Zap, text: '₹300 donated to Education Fund', color: 'text-[#00D1FF]' },
    { icon: Target, text: 'New high score: 156 points', color: 'text-[#D4AF37]' },
  ]

  const [displayedActivities, setDisplayedActivities] = useState<typeof activities>([])
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    setDisplayedActivities(activities)
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Live <span className="text-neon-glow">Activity</span>
        </h2>

        {/* Activity Strip */}
        <div className="glass rounded-xl p-6 overflow-hidden">
          <div className="space-y-3">
            {displayedActivities.map((activity, index) => {
              const Icon = activity.icon
              const isVisible =
                index >= scrollPosition && index < scrollPosition + 3
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                  <span className={`${activity.color} text-sm font-medium`}>
                    ✨ {activity.text}
                  </span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Auto-scroll indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {activities.slice(0, 3).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === scrollPosition % 3
                  ? 'w-8 bg-[#00D1FF]'
                  : 'w-2 bg-[#00D1FF] opacity-40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
