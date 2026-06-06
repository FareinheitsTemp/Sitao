import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CabinetNav } from '@/components/cabinet/CabinetNav'

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, display_name, avatar_url, role, status')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <CabinetNav profile={profile} />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
