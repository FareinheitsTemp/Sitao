import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CabinetNav } from '@/components/cabinet/CabinetNav'

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  console.log('[cabinet/layout] user:', user?.id ?? 'NULL', '| error:', error?.message ?? 'none')

  if (error || !user) {
    console.log('[cabinet/layout] -> redirecting to /auth/login (no user)')
    redirect('/auth/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, nickname, display_name, avatar_url, role, status')
    .eq('id', user!.id)
    .single()

  console.log('[cabinet/layout] profile:', profile?.id ?? 'NULL', '| profileError:', profileError?.message ?? 'none')

  if (!profile) {
    console.log('[cabinet/layout] -> redirecting to /auth/login (no profile)')
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
