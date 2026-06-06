import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/components/cabinet/ProfileEditForm'
import { ProfileHeader } from '@/components/cabinet/ProfileHeader'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  return (
    <div className="space-y-5">
      <ProfileHeader profile={profile} email={user.email ?? ''} />
      <ProfileEditForm profile={profile} />
    </div>
  )
}
