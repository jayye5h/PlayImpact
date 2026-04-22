'use client'

import { FloatingParticles } from './floating-particles'

export function AuthVisual() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1A1033] via-[#0A0A0F] to-[#000000]">
      <FloatingParticles />
      
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-neon-glow">
            Play.
          </h1>
          <h1 className="text-5xl font-bold mb-6 text-neon-glow">
            Win.
          </h1>
          <h1 className="text-5xl font-bold mb-12 text-gold-glow">
            Make Impact.
          </h1>
          
          <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
            Turn your gaming skills into real-world change. Every victory counts.
          </p>
        </div>
      </div>
    </div>
  )
}
