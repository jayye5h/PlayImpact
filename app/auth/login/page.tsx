import { AuthVisual } from '@/components/auth-visual'
import { LoginForm } from '@/components/login-form'

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string }
}) {
  const error = searchParams?.error
  const next = searchParams?.next

  return (
    <div className="flex min-h-screen">
      <AuthVisual />

      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue your gaming journey</p>
          </div>

          <div className="glass rounded-2xl p-4 border border-[#00D1FF]/20 neon-glow sm:p-8">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {decodeURIComponent(error)}
              </div>
            )}
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </div>
  )
}
