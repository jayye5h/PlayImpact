'use client'

import Link from 'next/link'
import { Heart, Mail, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="about" className="relative border-t border-[#00D1FF] border-opacity-20 glass mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold mb-4 block">
              <span className="text-neon-glow">PLAY</span>
              <span className="text-white">Impact</span>
            </Link>
            <p className="text-[#A0A0A8] text-sm">Gaming for a better world. Play. Win. Give.</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-it-works" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#about" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#charities" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  Charities
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  Impact Report
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-[#A0A0A8] hover:text-neon-glow transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg glass hover:border-[#00D1FF] transition text-[#00D1FF]"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass hover:border-[#00D1FF] transition text-[#00D1FF]"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg glass hover:border-[#00D1FF] transition text-[#00D1FF]"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#00D1FF] border-opacity-20 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-[#A0A0A8] text-sm">
            © {currentYear} PlayImpact. Made with <Heart className="w-4 h-4 inline text-red-500" /> for a better world.
          </p>

          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <Link href="/#about" className="text-[#A0A0A8] hover:text-neon-glow transition">
              Privacy Policy
            </Link>
            <Link href="/#about" className="text-[#A0A0A8] hover:text-neon-glow transition">
              Terms of Service
            </Link>
            <Link href="/#about" className="text-[#A0A0A8] hover:text-neon-glow transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
