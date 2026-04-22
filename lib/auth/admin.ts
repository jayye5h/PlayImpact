import { createSupabaseServerClient } from '@/lib/supabase/server'

function getConfiguredAdminEmails() {
  const emails = [
    process.env.ADMIN_EMAIL,
    ...(process.env.ADMIN_EMAILS || '').split(','),
  ]

  return emails
    .map((email) => email?.trim().toLowerCase())
    .filter((email): email is string => Boolean(email))
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  return getConfiguredAdminEmails().includes(email.toLowerCase())
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user || !isAdminEmail(user.email)) {
    throw new Error('Not authorized')
  }

  return user
}
