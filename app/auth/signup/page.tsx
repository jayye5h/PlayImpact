import { AuthVisual } from '@/components/auth-visual'
import { SignupForm } from '@/components/signup-form'

export default function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const error = searchParams?.error

  return (
    <div className="flex min-h-screen">
      <AuthVisual />

      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join PlayImpact</h2>
            <p className="text-gray-400">Create your account and start making impact</p>
          </div>

          <div className="glass rounded-2xl p-4 border border-[#00D1FF]/20 neon-glow sm:p-8">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {decodeURIComponent(error)}
              </div>
            )}
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}
