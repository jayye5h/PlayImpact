'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUpAction } from '@/app/auth/actions'

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      setIsLoading(false)
      return
    }

    const fd = new FormData()
    fd.set('name', formData.name)
    fd.set('email', formData.email)
    fd.set('password', formData.password)

    await signUpAction(fd)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-[#00D1FF]/30 bg-[rgba(0,209,255,0.05)] text-white placeholder-gray-500 focus:outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/50 focus:bg-[rgba(0,209,255,0.1)] transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-[#00D1FF]/30 bg-[rgba(0,209,255,0.05)] text-white placeholder-gray-500 focus:outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/50 focus:bg-[rgba(0,209,255,0.1)] transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg glass border border-[#00D1FF]/30 bg-[rgba(0,209,255,0.05)] text-white placeholder-gray-500 focus:outline-none focus:border-[#00D1FF] focus:ring-2 focus:ring-[#00D1FF]/50 focus:bg-[rgba(0,209,255,0.1)] transition-all duration-300"
        />
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#00D1FF] focus:ring-[#00D1FF] mt-1"
          required
        />
        <span className="text-sm text-gray-400">
          I agree to the{' '}
          <Link href="#" className="text-[#00D1FF] hover:text-[#00D1FF]/80">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="#" className="text-[#00D1FF] hover:text-[#00D1FF]/80">
            Privacy Policy
          </Link>
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-lg font-semibold text-[#0A0A0F] bg-gradient-to-r from-[#00D1FF] to-[#00B8D4] hover:from-[#00E5FF] hover:to-[#00D1FF] disabled:opacity-50 disabled:cursor-not-allowed neon-glow transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-center text-gray-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#00D1FF] hover:text-[#00D1FF]/80 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
