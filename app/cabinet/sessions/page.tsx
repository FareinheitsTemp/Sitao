import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SessionsList } from '@/components/cabinet/SessionsList'

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: sessions } = await supabase
    .from('login_sessions')
    .select('id, country_code, is_suspicious, created_at, expires_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return <SessionsList sessions={sessions ?? []} />
}
