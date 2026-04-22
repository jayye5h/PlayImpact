'use client'

export default function ScoreBubbles({ scores = [] }: { scores?: number[] }) {
  const padded = [...scores]
  while (padded.length < 5) padded.push(0)

  return (
    <div className="grid grid-cols-5 gap-2 mb-8 sm:gap-4">
      {padded.slice(0, 5).map((score, index) => (
        <div key={index} className="flex justify-center">
          <div className="relative flex h-12 w-12 items-center justify-center float sm:h-16 sm:w-16 lg:h-20 lg:w-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00D1FF] to-transparent opacity-20 blur-lg"></div>

            <div className="relative flex h-12 w-12 items-center justify-center rounded-full glass border-2 border-[#00D1FF] neon-glow sm:h-16 sm:w-16 lg:h-20 lg:w-20">
              <span className="text-lg font-bold text-neon-glow text-center sm:text-xl lg:text-2xl">{score || '-'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
