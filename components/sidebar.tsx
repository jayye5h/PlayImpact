'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Award, Gift, Heart, Home, LogOut, User } from 'lucide-react'
import { useTransition } from 'react'
import { signOutAction } from '@/app/auth/actions'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/scores', label: 'Scores', icon: Award },
  { href: '/dashboard/draw', label: 'Draw', icon: Gift },
  { href: '/dashboard/charity', label: 'Charity', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const logout = () => startTransition(() => signOutAction())

  return (
    <div className="sticky top-0 z-50 w-full glass rounded-none border-b border-[rgba(255,255,255,0.1)] md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.1)] p-4 md:block md:p-6">
        <div>
          <h1 className="text-xl font-bold text-neon-glow md:text-2xl">PlayImpact</h1>
          <p className="hidden text-sm text-[#A0A0A8] mt-1 sm:block">Gaming with Purpose</p>
        </div>

        <button
          disabled={isPending}
          onClick={logout}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-[rgba(255,68,68,0.3)] bg-[rgba(255,68,68,0.1)] px-3 py-2 text-sm text-[#FF4444] transition-all duration-300 hover:bg-[rgba(255,68,68,0.2)] disabled:opacity-50 md:hidden"
        >
          <LogOut size={18} />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 md:block md:space-y-2 md:p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-300 md:gap-3 md:px-4 md:py-3 md:text-base ${
                isActive
                  ? 'bg-[rgba(0,209,255,0.2)] text-neon-glow neon-glow border border-[#00D1FF]'
                  : 'text-[#E5E7EB] hover:bg-[rgba(255,255,255,0.08)]'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4 hidden md:block">
        <button
          disabled={isPending}
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[rgba(255,68,68,0.1)] text-[#FF4444] hover:bg-[rgba(255,68,68,0.2)] transition-all duration-300 border border-[rgba(255,68,68,0.3)] disabled:opacity-50"
        >
          <LogOut size={20} />
          <span className="font-medium">{isPending ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  )
}
