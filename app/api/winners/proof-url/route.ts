import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/auth/admin'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const winnerId = url.searchParams.get('winnerId')

  if (!winnerId) {
    return NextResponse.json({ ok: false, error: 'Missing winnerId' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { data: winner, error: winnerError } = await supabase
    .from('winners')
    .select('id, user_id, proof_url')
    .eq('id', winnerId)
    .single()

  if (winnerError || !winner) {
    return NextResponse.json({ ok: false, error: 'Winner not found' }, { status: 404 })
  }

  const isAdmin = isAdminEmail(user.email)
  if (!isAdmin && winner.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  if (!winner.proof_url) {
    return NextResponse.json({ ok: false, error: 'No proof uploaded' }, { status: 404 })
  }

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.storage.from('proofs').createSignedUrl(winner.proof_url, 60 * 5)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to sign URL' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: { signedUrl: data.signedUrl } })
}
