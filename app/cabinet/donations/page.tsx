import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DonationsList } from '@/components/cabinet/DonationsList'

export default async function DonationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <DonationsList donations={donations ?? []} />
}
