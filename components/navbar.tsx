'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-neon-glow">PLAY</span>
            <span className="text-white">Impact</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-foreground hover:text-neon-glow transition">
              How It Works
            </Link>
            <Link href="#charities" className="text-foreground hover:text-neon-glow transition">
              Charities
            </Link>
            <Link href="#about" className="text-foreground hover:text-neon-glow transition">
              About
            </Link>
            <Link href="/auth/login?next=/dashboard" className="text-foreground hover:text-neon-glow transition">
              Login
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/auth/signup"
              className="px-6 py-2 rounded-lg bg-[#00D1FF] text-[#0A0A0F] font-bold hover:neon-glow transition inline-block"
            >
              Start Playing
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 glass rounded-lg p-4">
            <Link href="#how-it-works" className="block text-foreground hover:text-neon-glow">
              How It Works
            </Link>
            <Link href="#charities" className="block text-foreground hover:text-neon-glow">
              Charities
            </Link>
            <Link href="#about" className="block text-foreground hover:text-neon-glow">
              About
            </Link>
            <Link href="/auth/login?next=/dashboard" className="block text-foreground hover:text-neon-glow">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="w-full px-6 py-2 rounded-lg bg-[#00D1FF] text-[#0A0A0F] font-bold inline-block text-center"
            >
              Start Playing
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
