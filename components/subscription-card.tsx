'use client'

import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionCard({
  planLabel = 'No Subscription',
  renewsOn,
  onManage,
  manageHref,
}: {
  planLabel?: string
  renewsOn?: string | null
  onManage?: () => void
  manageHref?: string
}) {
  return (
    <div className="glass rounded-xl p-6 border border-[#D4AF37] mb-8 bg-gradient-to-r from-[rgba(212,175,55,0.05)] to-[rgba(0,209,255,0.05)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFE66D] flex items-center justify-center">
            <Zap size={24} className="text-[#0A0A0F]" />
          </div>
          <div>
            <p className="text-[#D4AF37] font-semibold">{planLabel}</p>
            <p className="text-xs text-[#A0A0A8]">
              {renewsOn ? `Renews on ${renewsOn}` : 'Select a plan to activate'}
            </p>
          </div>
        </div>
        {manageHref ? (
          <Link
            href={manageHref}
            className="w-full px-6 py-2 rounded-lg border border-[#D4AF37] text-center text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-300 font-medium text-sm sm:w-auto"
          >
            Manage
          </Link>
        ) : (
          <button
            onClick={onManage}
            className="w-full px-6 py-2 rounded-lg border border-[#D4AF37] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-300 font-medium text-sm sm:w-auto"
          >
            Manage
          </button>
        )}
      </div>
    </div>
  )
}
