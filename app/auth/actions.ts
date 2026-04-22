'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function isConfiguredAdminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD

  return Boolean(
    adminEmail &&
    adminPassword &&
    email.toLowerCase() === adminEmail &&
    password === adminPassword,
  )
}

async function ensureConfiguredAdminUser(email: string, password: string) {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.auth.admin.listUsers()

  if (error) {
    throw new Error(error.message)
  }

  const existing = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())

  if (existing) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { name: 'Admin' },
    })

    if (updateError) {
      throw new Error(updateError.message)
    }

    return
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: 'Admin' },
  })

  if (createError) {
    throw new Error(createError.message)
  }
}

export async function signInAction(formData: FormData) {
  const email = getString(formData, 'email')
  const password = getString(formData, 'password')
  const next = getString(formData, 'next')

  const supabase = await createSupabaseServerClient()

  if (isConfiguredAdminLogin(email, password)) {
    try {
      await ensureConfiguredAdminUser(email, password)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to prepare admin account'
      redirect(`/auth/login?error=${encodeURIComponent(message)}${next ? `&next=${encodeURIComponent(next)}` : ''}`)
    }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}${next ? `&next=${encodeURIComponent(next)}` : ''}`)
  }

  redirect(next || '/dashboard')
}

export async function signUpAction(formData: FormData) {
  const name = getString(formData, 'name')
  const email = getString(formData, 'email')
  const password = getString(formData, 'password')

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard/profile')
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
