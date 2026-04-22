import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CharityClient from './CharityClient'

export default async function CharityPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('charity_id, charity_percentage')
    .eq('id', user.id)
    .maybeSingle()

  const { data: charities } = await supabase
    .from('charities')
    .select('id, name, description, image_url, total_raised')
    .order('created_at', { ascending: false })

  return (
    <CharityClient
      charities={(charities || []) as any}
      initialSelectedCharityId={profile?.charity_id || null}
      initialPercentage={typeof profile?.charity_percentage === 'number' ? profile.charity_percentage : 10}
    />
  )
}
