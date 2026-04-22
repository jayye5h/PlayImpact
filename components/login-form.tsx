'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signInAction } from '@/app/auth/actions'

export function LoginForm({ next }: { next?: string | null }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const resolvedNext = next

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.set('email', email)
    formData.set('password', password)
    if (resolvedNext) formData.set('next', resolvedNext)

    await signInAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-[#00D1FF]/30 bg-[rgba(0,209,255,0.05)] text-white placeholder-gray-500 focus:outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/50 focus:bg-[rgba(0,209,255,0.1)] transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-[#00D1FF]/30 bg-[rgba(0,209,255,0.05)] text-white placeholder-gray-500 focus:outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/50 focus:bg-[rgba(0,209,255,0.1)] transition-all duration-300"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#00D1FF] focus:ring-[#00D1FF]"
          />
          <span className="ml-2 text-sm text-gray-400">Remember me</span>
        </label>
        <Link href="#" className="text-sm text-[#00D1FF] hover:text-[#00D1FF]/80 transition-colors">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-lg font-semibold text-[#0A0A0F] bg-gradient-to-r from-[#00D1FF] to-[#00B8D4] hover:from-[#00E5FF] hover:to-[#00D1FF] disabled:opacity-50 disabled:cursor-not-allowed neon-glow transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <p className="text-center text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-[#00D1FF] hover:text-[#00D1FF]/80 font-semibold transition-colors">
          Create one
        </Link>
      </p>
    </form>
  )
}
