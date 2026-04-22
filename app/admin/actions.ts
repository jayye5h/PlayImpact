'use server'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'

export async function adminUpsertCharityAction(input: {
  id?: string
  name: string
  description: string
  image_url?: string | null
}) {
  await requireAdmin()
  const admin = createSupabaseAdminClient()

  const payload = {
    name: input.name,
    description: input.description,
    image_url: input.image_url ?? null,
  }

  if (input.id) {
    const { data, error } = await admin
      .from('charities')
      .update(payload)
      .eq('id', input.id)
      .select('id, name, description, total_raised, image_url')
      .single()

    if (error) return { ok: false as const, error: error.message }
    return { ok: true as const, data }
  }

  const { data, error } = await admin
    .from('charities')
    .insert(payload)
    .select('id, name, description, total_raised, image_url')
    .single()

  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, data }
}

export async function adminDeleteCharityAction(id: string) {
  await requireAdmin()
  const admin = createSupabaseAdminClient()
  const { error } = await admin.from('charities').delete().eq('id', id)
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}

export async function adminSetWinnerStatusAction(
  winnerId: string,
  status: 'pending' | 'approved' | 'rejected' | 'paid',
) {
  await requireAdmin()
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from('winners')
    .update({ status })
    .eq('id', winnerId)
    .select('id, status')
    .single()

  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const, data }
}
