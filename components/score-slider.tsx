'use client'

import { useState } from 'react'

interface ScoreSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function ScoreSlider({ value, onChange }: ScoreSliderProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="range"
          min="1"
          max="45"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-[#00D1FF] to-[#0099FF] rounded-lg appearance-none cursor-pointer accent-[#00D1FF]"
          style={{
            background: `linear-gradient(to right, #00D1FF 0%, #00D1FF ${(value / 45) * 100}%, rgba(255,255,255,0.1) ${(value / 45) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
        <style>{`
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #00D1FF;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(0, 209, 255, 0.8), 0 0 40px rgba(0, 209, 255, 0.5);
            border: 2px solid rgba(255,255,255,0.2);
            transition: all 0.2s ease;
          }
          input[type='range']::-webkit-slider-thumb:hover {
            box-shadow: 0 0 30px rgba(0, 209, 255, 1), 0 0 60px rgba(0, 209, 255, 0.6);
            transform: scale(1.1);
          }
          input[type='range']::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #00D1FF;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(0, 209, 255, 0.8), 0 0 40px rgba(0, 209, 255, 0.5);
            border: 2px solid rgba(255,255,255,0.2);
            transition: all 0.2s ease;
          }
          input[type='range']::-moz-range-thumb:hover {
            box-shadow: 0 0 30px rgba(0, 209, 255, 1), 0 0 60px rgba(0, 209, 255, 0.6);
            transform: scale(1.1);
          }
        `}</style>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-5xl font-bold text-[#00D1FF] text-neon-glow animate-pulse">
          {value}
        </div>
      </div>
    </div>
  )
}
