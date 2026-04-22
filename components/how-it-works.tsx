'use client'

import { Zap, Heart, Trophy } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Zap,
      title: 'Enter Scores',
      description: 'Submit your gaming scores and achievements from your favorite games',
    },
    {
      icon: Heart,
      title: 'Win Big',
      description: 'Compete monthly for amazing prizes and exclusive rewards',
    },
    {
      icon: Trophy,
      title: 'Make Impact',
      description: 'Your winnings automatically support charities you care about',
    },
  ]

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It <span className="text-neon-glow">Works</span>
          </h2>
          <p className="text-xl text-[#A0A0A8]">Three simple steps to gaming with purpose</p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="glass rounded-xl p-8 group hover:border-[#00D1FF] transition duration-300 cursor-pointer"
              >
                {/* Icon Container */}
                <div className="mb-6 inline-block p-4 rounded-lg bg-[#1A1033] group-hover:bg-[#00D1FF] group-hover:bg-opacity-20 transition">
                  <Icon className="w-8 h-8 text-[#00D1FF] group-hover:text-[#00D1FF] transition" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-[#A0A0A8] leading-relaxed">{step.description}</p>

                {/* Number Badge */}
                <div className="mt-6 inline-block px-3 py-1 rounded-full bg-[#00D1FF] bg-opacity-10 border border-[#00D1FF] border-opacity-30">
                  <span className="text-[#00D1FF] font-bold text-sm">Step {index + 1}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
