import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const winnerId = form.get('winnerId')
  const file = form.get('file')

  if (typeof winnerId !== 'string' || !winnerId) {
    return NextResponse.json({ ok: false, error: 'Missing winnerId' }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Missing file' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ ok: false, error: 'Only image uploads are allowed' }, { status: 400 })
  }

  // 5MB guardrail
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const { data: winner, error: winnerError } = await supabase
    .from('winners')
    .select('id, user_id, status')
    .eq('id', winnerId)
    .single()

  if (winnerError || !winner) {
    return NextResponse.json({ ok: false, error: 'Winner not found' }, { status: 404 })
  }

  if (winner.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  if (winner.status === 'paid') {
    return NextResponse.json({ ok: false, error: 'Already paid' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()

  const safeName = sanitizeFileName(file.name || 'proof')
  const objectPath = `${user.id}/${winnerId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await admin.storage.from('proofs').upload(objectPath, file, {
    contentType: file.type,
    upsert: true,
  })

  if (uploadError) {
    return NextResponse.json(
      {
        ok: false,
        error:
          uploadError.message +
          " (ensure a Storage bucket named 'proofs' exists in Supabase)",
      },
      { status: 500 },
    )
  }

  const { error: updateError } = await admin
    .from('winners')
    .update({ proof_url: objectPath, status: 'pending' })
    .eq('id', winnerId)

  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: { objectPath } })
}
