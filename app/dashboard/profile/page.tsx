import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('plan_type, expiry_date')
    .eq('id', user.id)
    .maybeSingle()

  return <ProfileClient currentPlanType={profile?.plan_type || null} expiryDate={profile?.expiry_date || null} />
}
