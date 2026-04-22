'use client'

import { useState, useTransition } from 'react'
import Sidebar from '@/components/sidebar'
import CharityCard from '@/components/charity-card'
import { selectCharityAction } from '@/app/dashboard/actions'

type Charity = {
    id: string
    name: string
    description: string | null
    image_url: string | null
    total_raised: number | string | null
}

export default function CharityClient({
    charities,
    initialSelectedCharityId,
    initialPercentage,
}: {
    charities: Charity[]
    initialSelectedCharityId: string | null
    initialPercentage: number
}) {
    const [selectedCharity, setSelectedCharity] = useState<string | null>(initialSelectedCharityId)
    const [percentage, setPercentage] = useState<number>(initialPercentage)
    const [isPending, startTransition] = useTransition()

    const selected = charities.find((c) => c.id === selectedCharity)

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1033] md:flex-row">
            <Sidebar />

            <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Select Your Charity</h1>
                        <p className="text-[#A0A0A8]">Choose a charity partner to support with your winnings</p>
                    </div>

                    {/* Charity Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
                        {charities.map((charity) => (
                            <CharityCard
                                key={charity.id}
                                id={charity.id}
                                name={charity.name}
                                description={charity.description || ''}
                                raised={Number(charity.total_raised || 0)}
                                image={
                                    charity.image_url ||
                                    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=400&fit=crop'
                                }
                                selected={selectedCharity === charity.id}
                                onSelect={setSelectedCharity}
                            />
                        ))}
                    </div>

                    {!charities.length && (
                        <div className="glass rounded-2xl p-6 border border-[#00D1FF]/30 text-center text-[#A0A0A8] md:p-8">
                            No charities found. Ask an admin to add charities in the Admin Panel.
                        </div>
                    )}

                    {/* Selected Charity Info */}
                    {selectedCharity && selected && (
                        <div className="glass rounded-2xl p-6 border border-[#D4AF37]/50 md:p-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">{selected.name}</h2>
                                <p className="text-[#A0A0A8] mb-6">{selected.description}</p>

                                <div className="max-w-sm mx-auto mb-6">
                                    <label className="block text-sm font-semibold text-[#E5E7EB] mb-2">Contribution Percentage</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={percentage}
                                        onChange={(e) => setPercentage(Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-lg bg-[#1A1033]/60 border border-[#D4AF37]/50 text-[#E5E7EB] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all"
                                    />
                                    <p className="text-xs text-[#A0A0A8] mt-2">This percent of any prize you win is donated automatically.</p>
                                </div>

                                <button
                                    disabled={isPending}
                                    onClick={() => startTransition(() => selectCharityAction(selectedCharity, percentage))}
                                    className="w-full px-8 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0F] font-bold hover:shadow-[0_0_30px_rgba(212,175,55,0.8)] transition-all neon-glow disabled:opacity-50 sm:w-auto"
                                >
                                    {isPending ? 'Saving…' : 'Confirm Selection'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
