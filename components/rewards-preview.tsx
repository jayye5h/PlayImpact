'use client'

import { Trophy, Star, Award } from 'lucide-react'
import Link from 'next/link'

export default function RewardsPreview() {
  const rewards = [
    {
      icon: Trophy,
      matches: '5 Match',
      title: 'Jackpot',
      prize: '₹50,000',
      color: 'text-[#D4AF37]',
      bgColor: 'bg-[#D4AF37]',
      isJackpot: true,
    },
    {
      icon: Award,
      matches: '4 Match',
      title: 'Medium Prize',
      prize: '₹10,000',
      color: 'text-[#00D1FF]',
      bgColor: 'bg-[#00D1FF]',
      isJackpot: false,
    },
    {
      icon: Star,
      matches: '3 Match',
      title: 'Small Reward',
      prize: '₹2,500',
      color: 'text-green-400',
      bgColor: 'bg-green-400',
      isJackpot: false,
    },
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-5xl">
            Win Big <span className="text-neon-glow">Every Month</span>
          </h2>
          <p className="text-xl text-[#A0A0A8]">Incredible prizes await you</p>
        </div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {rewards.map((reward, index) => {
            const Icon = reward.icon
            return (
              <div
                key={index}
                className={`relative rounded-xl p-6 transition transform hover:scale-105 md:p-8 ${reward.isJackpot
                    ? `glass border-2 border-[#D4AF37] gold-glow`
                    : 'glass hover:border-[#00D1FF]'
                  }`}
              >
                {/* Jackpot Badge */}
                {reward.isJackpot && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-[#0A0A0F] font-bold text-sm">
                    JACKPOT 🎉
                  </div>
                )}

                {/* Icon */}
                <div className={`mb-6 inline-block p-4 rounded-lg bg-${reward.bgColor} bg-opacity-20`}>
                  <Icon className={`w-8 h-8 ${reward.color}`} />
                </div>

                {/* Match Count */}
                <div className="mb-3 inline-block px-3 py-1 rounded-full bg-[#00D1FF] bg-opacity-10 border border-[#00D1FF] border-opacity-30">
                  <span className="text-[#00D1FF] font-bold text-sm">{reward.matches}</span>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold mb-2 ${reward.color}`}>{reward.title}</h3>

                {/* Prize Amount */}
                <p className="text-3xl font-bold text-white mb-6 sm:text-4xl">{reward.prize}</p>

                {/* Description */}
                <p className="text-[#A0A0A8] text-sm mb-6">
                  {reward.isJackpot
                    ? 'Match all numbers and win our biggest prize!'
                    : 'Match numbers and claim your reward'}
                </p>

                {/* Action Button */}
                <Link
                  href="/auth/signup"
                  className={`w-full py-3 rounded-lg font-bold transition inline-block text-center ${reward.isJackpot
                      ? `bg-[#D4AF37] text-[#0A0A0F] hover:shadow-lg hover:shadow-[#D4AF37]`
                      : `bg-[#00D1FF] bg-opacity-10 text-[#00D1FF] border border-[#00D1FF] border-opacity-50 hover:bg-opacity-20`
                    }`}
                >
                  {reward.isJackpot ? 'Aim for Gold' : 'Play Now'}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
