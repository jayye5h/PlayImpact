'use client'

import { useState, useTransition } from 'react'
import Sidebar from '@/components/sidebar'
import PlanCard from '@/components/plan-card'
import { selectPlanAction } from '@/app/dashboard/actions'
import { isPlanType, planLabel, planPriceInr, type PlanType } from '@/lib/domain/plans'

export default function ProfileClient({
    currentPlanType,
    expiryDate,
}: {
    currentPlanType: string | null
    expiryDate: string | null
}) {
    const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('yearly')
    const [isPending, startTransition] = useTransition()

    const monthlyFeatures = [
        'Max 5 active scores',
        'Monthly draw participation',
        'Standard rewards',
        'Charity tracking',
    ]

    const yearlyFeatures = [
        'Everything in Monthly',
        'Priority support',
        'VIP charity badge',
        'Annual bonus draw',
    ]

    const currentLabel = isPlanType(currentPlanType || '')
        ? planLabel(currentPlanType as PlanType)
        : 'No Subscription'

    const onChoose = (tier: 'basic' | 'premium') => {
        const plan = `${tier}_${selectedPeriod}`
        startTransition(() => selectPlanAction(plan))
    }

    const basicPlan = `basic_${selectedPeriod}`
    const premiumPlan = `premium_${selectedPeriod}`

    const basicPrice = isPlanType(basicPlan) ? planPriceInr(basicPlan) : selectedPeriod === 'monthly' ? 199 : 1990
    const premiumPrice = isPlanType(premiumPlan) ? planPriceInr(premiumPlan) : selectedPeriod === 'monthly' ? 499 : 4990

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1033] md:flex-row">
            <Sidebar />

            <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2 sm:text-4xl">Select Your Plan</h1>
                        <p className="text-[#A0A0A8]">Choose the perfect subscription for your gaming journey</p>
                    </div>

                    {/* Plan Toggle */}
                    <div className="flex justify-center gap-3 mb-8 sm:gap-4 md:mb-12">
                        <button
                            disabled={isPending}
                            onClick={() => setSelectedPeriod('monthly')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${selectedPeriod === 'monthly'
                                    ? 'bg-[#00D1FF]/20 border border-[#00D1FF] text-[#00D1FF]'
                                    : 'text-[#A0A0A8] hover:text-[#E5E7EB]'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            disabled={isPending}
                            onClick={() => setSelectedPeriod('yearly')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${selectedPeriod === 'yearly'
                                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]'
                                    : 'text-[#A0A0A8] hover:text-[#E5E7EB]'
                                }`}
                        >
                            Yearly
                        </button>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 md:gap-8 md:mb-12">
                        <PlanCard
                            name="Basic"
                            price={basicPrice}
                            period={selectedPeriod}
                            features={selectedPeriod === 'monthly' ? monthlyFeatures : monthlyFeatures}
                            highlighted={false}
                            onSelect={() => onChoose('basic')}
                        />
                        <PlanCard
                            name="Premium"
                            price={premiumPrice}
                            period={selectedPeriod}
                            features={yearlyFeatures}
                            highlighted={true}
                            onSelect={() => onChoose('premium')}
                        />
                    </div>

                    {/* Current Plan Info */}
                    <div className="glass rounded-2xl p-6 border border-[#00D1FF]/30 md:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-[#E5E7EB] mb-2">Current Plan: {currentLabel}</h3>
                                <p className="text-[#A0A0A8]">
                                    {expiryDate ? `Expires on ${expiryDate}` : 'No active subscription'}
                                </p>
                            </div>
                            <div className="w-full px-6 py-2 rounded-lg border border-[#00D1FF]/50 text-center text-[#00D1FF] sm:w-auto">
                                {isPending ? 'Updating…' : 'Mock Billing'}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
