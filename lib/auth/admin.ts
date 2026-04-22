import { createSupabaseServerClient } from '@/lib/supabase/server'

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  const raw = process.env.ADMIN_EMAILS || ''
  const allowed = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return allowed.includes(email.toLowerCase())
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authorized')
  }

  return user
}
