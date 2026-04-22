import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import LiveActivity from '@/components/live-activity'
import RewardsPreview from '@/components/rewards-preview'
import FeaturedCharity from '@/components/featured-charity'
import FinalCTA from '@/components/final-cta'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <LiveActivity />
      <RewardsPreview />
      <FeaturedCharity />
      <FinalCTA />
      <Footer />
    </main>
  )
}
