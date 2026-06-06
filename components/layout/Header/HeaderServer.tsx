import { createClient } from '@/lib/supabase/server'
import Header from './index'

export default async function HeaderServer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, display_name, avatar_url, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return <Header user={user ? { id: user.id } : null} profile={profile} />
}
