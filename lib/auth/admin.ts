import { createSupabaseServerClient } from '@/lib/supabase/server'

function getConfiguredAdminEmails() {
  const emails = [process.env.ADMIN_EMAIL]

  return emails
    .map((email) => email?.trim().toLowerCase())
    .filter((email): email is string => Boolean(email))
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  return getConfiguredAdminEmails().includes(email.toLowerCase())
}

export function hasCustomAdminAccess(user: {
  email?: string | null
  app_metadata?: Record<string, unknown>
} | null | undefined) {
  return isAdminEmail(user?.email) && user?.app_metadata?.custom_admin === true
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !hasCustomAdminAccess(user)) {
    throw new Error('Not authorized')
  }

  return user
}
