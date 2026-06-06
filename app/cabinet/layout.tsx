import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CabinetNav } from '@/components/cabinet/CabinetNav'

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // getUser() валідує токен через Supabase API — надійніше ніж getSession()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, display_name, avatar_url, role, status')
    .eq('id', user!.id)
    .single()

  if (!profile) {
    // Профіль не існує — можливо тригер не спрацював, даємо час
    redirect('/auth/login?error=profile_not_found')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <CabinetNav profile={profile!} />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
