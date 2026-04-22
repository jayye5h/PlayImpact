'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Gift, Heart, LogOut, Trophy, Users } from 'lucide-react'
import { useTransition } from 'react'
import { signOutAction } from '@/app/auth/actions'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/draw', label: 'Draw', icon: Gift },
  { href: '/admin/charities', label: 'Charities', icon: Heart },
  { href: '/admin/winners', label: 'Winners', icon: Trophy },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const logout = () => startTransition(() => signOutAction())

  return (
    <aside className="sticky top-0 z-50 w-full glass border-b border-[#00D1FF]/30 md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-b-0 md:border-r md:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-[#00D1FF]/20 p-4 md:mb-12 md:block md:border-b-0 md:p-0">
        <div>
          <h1 className="text-xl font-bold text-[#00D1FF] md:mb-2 md:text-2xl">PlayImpact</h1>
          <p className="text-xs text-[#A0A0A8]">Admin Panel</p>
        </div>

        <button
          disabled={isPending}
          onClick={logout}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-[#FF4444]/50 px-3 py-2 text-sm text-[#FF4444] transition-all hover:bg-[#FF4444]/10 disabled:opacity-50 md:hidden"
        >
          <LogOut size={18} />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:space-y-2 md:p-0">
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all md:gap-3 md:px-4 md:py-3 md:text-base ${
                isActive
                  ? 'bg-[#00D1FF]/20 border border-[#00D1FF] text-[#00D1FF]'
                  : 'text-[#A0A0A8] hover:text-[#E5E7EB] hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        disabled={isPending}
        onClick={logout}
        className="hidden w-full rounded-lg border border-[#FF4444]/50 px-4 py-3 font-medium text-[#FF4444] transition-all hover:bg-[#FF4444]/10 disabled:opacity-50 md:block"
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    </aside>
  )
}
