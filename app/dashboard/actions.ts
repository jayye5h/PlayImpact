'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isPlanType, planDurationDays, planPriceInr, type PlanType } from '@/lib/domain/plans'
import { calculatePrizeSplits, intersectionCount, randomUniqueNumbers, type DrawMode } from '@/lib/domain/draw'
import { requireAdmin } from '@/lib/auth/admin'

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function weightedPickUniqueNumbers(
  counts: Map<number, number>,
  pickCount: number,
  min: number,
  max: number,
): number[] {
  const entries = Array.from(counts.entries())
    .filter(([n, w]) => Number.isFinite(n) && n >= min && n <= max && w > 0)
    .map(([n, w]) => ({ n, w }))

  const picked: number[] = []
  while (picked.length < pickCount && entries.length > 0) {
    const total = entries.reduce((s, e) => s + e.w, 0)
    let r = Math.random() * total
    let idx = 0
    for (; idx < entries.length; idx++) {
      r -= entries[idx].w
      if (r <= 0) break
    }
    const chosenIndex = Math.min(idx, entries.length - 1)
    picked.push(entries[chosenIndex].n)
    entries.splice(chosenIndex, 1)
  }

  if (picked.length < pickCount) {
    const remaining = randomUniqueNumbers(pickCount - picked.length, min, max).filter(
      (n) => !picked.includes(n),
    )
    picked.push(...remaining)
  }

  return picked
}

export async function selectPlanAction(plan: string) {
  if (!isPlanType(plan)) {
    throw new Error('Invalid plan')
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const expiry = new Date()
  expiry.setDate(expiry.getDate() + planDurationDays(plan))

  const { error } = await supabase
    .from('users')
    .update({
      plan_type: plan,
      is_active: true,
      expiry_date: expiry.toISOString().slice(0, 10),
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  redirect('/dashboard')
}

export async function selectCharityAction(charityId: string, percentage: number) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const pct = Math.max(0, Math.min(100, Math.round(percentage)))

  const { error } = await supabase
    .from('users')
    .update({ charity_id: charityId, charity_percentage: pct })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  redirect('/dashboard')
}

export async function addScoreAction(score: number, date: string) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Require active subscription
  const { data: profile } = await supabase
    .from('users')
    .select('is_active, expiry_date')
    .eq('id', user.id)
    .maybeSingle()

  const expiryOk = profile?.expiry_date ? new Date(profile.expiry_date) >= new Date() : false
  if (!profile?.is_active || !expiryOk) {
    redirect('/dashboard/profile')
  }

  const { data, error } = await supabase.rpc('add_score', {
    p_score: score,
    p_date: date,
  })

  if (error) {
    return { ok: false as const, error: error.message }
  }

  return { ok: true as const, data }
}

export async function revealLatestDrawForUserAction() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: draw } = await supabase
    .from('draws')
    .select('id, draw_date, numbers')
    .order('draw_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!draw) {
    return { ok: false as const, error: 'No draw has been published yet.' }
  }

  const { data: scores } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(5)

  const userScores = (scores || []).map((s) => s.score)
  const matches = intersectionCount(userScores, draw.numbers || [])

  const { data: winner } = await supabase
    .from('winners')
    .select('prize, match_count, status, proof_url')
    .eq('user_id', user.id)
    .eq('draw_id', draw.id)
    .maybeSingle()

  const winnings = winner?.prize ? Number(winner.prize) : 0

  return {
    ok: true as const,
    data: {
      drawDate: draw.draw_date,
      numbers: draw.numbers as number[],
      matches: winner?.match_count ?? matches,
      winnings,
    },
  }
}

export async function adminSimulateDrawAction(mode: DrawMode) {
  await requireAdmin()

  const admin = createSupabaseAdminClient()

  // Eligible users: active + not expired
  const { data: users, error: usersError } = await admin
    .from('users')
    .select('id, plan_type, is_active, expiry_date')
    .eq('is_active', true)

  if (usersError) {
    return { ok: false as const, error: usersError.message }
  }

  const eligible = (users || []).filter((u) => {
    if (!u.is_active) return false
    if (!u.expiry_date) return false
    return new Date(u.expiry_date) >= new Date()
  })

  const totalPool = eligible.reduce((sum, u) => {
    const plan = (u.plan_type || '') as PlanType
    return isPlanType(plan) ? sum + planPriceInr(plan) : sum
  }, 0)

  const ids = eligible.map((u) => u.id)
  const { data: allScores, error: scoresError } = ids.length
    ? await admin
        .from('scores')
        .select('user_id, score, date')
        .in('user_id', ids)
        .order('date', { ascending: false })
    : { data: [], error: null }

  if (scoresError) {
    return { ok: false as const, error: scoresError.message }
  }

  const scoresByUser = new Map<string, number[]>()
  const scoreCounts = new Map<number, number>()
  for (const row of allScores || []) {
    const current = scoresByUser.get(row.user_id) || []
    if (current.length < 5) {
      current.push(row.score)
      scoresByUser.set(row.user_id, current)
      scoreCounts.set(row.score, (scoreCounts.get(row.score) || 0) + 1)
    }
  }

  const numbers = (
    mode === 'algorithm'
      ? weightedPickUniqueNumbers(scoreCounts, 5, 1, 45)
      : randomUniqueNumbers(5, 1, 45)
  ).sort((a, b) => a - b)

  const computed = eligible.map((u) => {
    const userScores = scoresByUser.get(u.id) || []
    const matchCount = intersectionCount(userScores, numbers)
    return { user_id: u.id, match_count: matchCount }
  })

  const splits = calculatePrizeSplits(totalPool)
  const winners5 = computed.filter((c) => c.match_count === 5)
  const winners4 = computed.filter((c) => c.match_count === 4)
  const winners3 = computed.filter((c) => c.match_count === 3)

  const per5 = winners5.length ? splits.match5 / winners5.length : 0
  const per4 = winners4.length ? splits.match4 / winners4.length : 0
  const per3 = winners3.length ? splits.match3 / winners3.length : 0

  const winnerCount = winners5.length + winners4.length + winners3.length
  const totalPrize = winners5.length * per5 + winners4.length * per4 + winners3.length * per3

  return {
    ok: true as const,
    data: {
      numbers,
      mode,
      timestamp: todayIsoDate(),
      winners: winnerCount,
      totalPrize,
      totalPool,
    },
  }
}

export async function adminPublishDrawAction(mode: DrawMode) {
  await requireAdmin()

  const admin = createSupabaseAdminClient()
  const drawDate = todayIsoDate()

  // Eligible users: active + not expired
  const { data: users, error: usersError } = await admin
    .from('users')
    .select('id, plan_type, is_active, expiry_date, charity_id, charity_percentage')
    .eq('is_active', true)

  if (usersError) {
    return { ok: false as const, error: usersError.message }
  }

  const eligible = (users || []).filter((u) => {
    if (!u.is_active) return false
    if (!u.expiry_date) return false
    return new Date(u.expiry_date) >= new Date()
  })

  const totalPool = eligible.reduce((sum, u) => {
    const plan = (u.plan_type || '') as PlanType
    return isPlanType(plan) ? sum + planPriceInr(plan) : sum
  }, 0)

  const ids = eligible.map((u) => u.id)
  const { data: allScores } = await admin
    .from('scores')
    .select('user_id, score, date')
    .in('user_id', ids)
    .order('date', { ascending: false })

  const scoresByUser = new Map<string, number[]>()
  const scoreCounts = new Map<number, number>()
  for (const row of allScores || []) {
    const current = scoresByUser.get(row.user_id) || []
    if (current.length < 5) {
      current.push(row.score)
      scoresByUser.set(row.user_id, current)
      scoreCounts.set(row.score, (scoreCounts.get(row.score) || 0) + 1)
    }
  }

  const numbers = (
    mode === 'algorithm'
      ? weightedPickUniqueNumbers(scoreCounts, 5, 1, 45)
      : randomUniqueNumbers(5, 1, 45)
  ).sort((a, b) => a - b)

  const { data: draw, error: drawError } = await admin
    .from('draws')
    .insert({ draw_date: drawDate, numbers, type: mode })
    .select('id, draw_date, numbers')
    .single()

  if (drawError) {
    return { ok: false as const, error: drawError.message }
  }

  const splits = calculatePrizeSplits(totalPool)

  const computed = eligible.map((u) => {
    const userScores = scoresByUser.get(u.id) || []
    const matchCount = intersectionCount(userScores, numbers)
    return { user_id: u.id, match_count: matchCount, charity_id: u.charity_id, charity_percentage: u.charity_percentage }
  })

  const winners5 = computed.filter((c) => c.match_count === 5)
  const winners4 = computed.filter((c) => c.match_count === 4)
  const winners3 = computed.filter((c) => c.match_count === 3)

  const per5 = winners5.length ? splits.match5 / winners5.length : 0
  const per4 = winners4.length ? splits.match4 / winners4.length : 0
  const per3 = winners3.length ? splits.match3 / winners3.length : 0

  const winnerRows = computed
    .filter((c) => c.match_count >= 3)
    .map((c) => ({
      user_id: c.user_id,
      draw_id: draw.id,
      match_count: c.match_count,
      prize: c.match_count === 5 ? per5 : c.match_count === 4 ? per4 : per3,
      status: 'pending',
    }))

  if (winnerRows.length) {
    const { error: winnersError } = await admin.from('winners').insert(winnerRows)
    if (winnersError) {
      return { ok: false as const, error: winnersError.message }
    }
  }

  // Apply charity totals for winners (donation = prize * %)
  const charityAdds = new Map<string, number>()
  for (const c of computed) {
    if (c.match_count < 3) continue
    if (!c.charity_id) continue
    const pct = typeof c.charity_percentage === 'number' ? c.charity_percentage : 0
    const prize = c.match_count === 5 ? per5 : c.match_count === 4 ? per4 : per3
    const donation = (prize * pct) / 100
    charityAdds.set(c.charity_id, (charityAdds.get(c.charity_id) || 0) + donation)
  }

  for (const [charityId, add] of charityAdds.entries()) {
    await admin.rpc('increment_charity_total', { p_charity_id: charityId, p_amount: add }).catch(() => {})
  }

  return {
    ok: true as const,
    data: {
      drawDate: draw.draw_date,
      numbers: draw.numbers as number[],
      totalPool,
      winners: winnerRows.length,
      totalPrize: winnerRows.reduce((s, w) => s + Number(w.prize), 0),
    },
  }
}
