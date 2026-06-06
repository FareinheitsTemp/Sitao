import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const countryFlag = (code: string | null) => {
  if (!code) return null
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  )
}

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: sessions } = await supabase
    .from('login_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--foreground)]">Сесії входу</h2>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <p className="text-[var(--muted)]">Сесій поки немає</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`bg-[var(--surface)] border rounded-xl p-4 ${
                s.is_suspicious ? 'border-red-500/40 bg-red-500/5' : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {countryFlag(s.country_code) && (
                      <span className="text-base">{countryFlag(s.country_code)}</span>
                    )}
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {s.country_code ?? 'Невідома країна'}
                    </p>
                    {s.is_suspicious && (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Підозріло
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--muted)] text-xs mt-0.5">
                    {new Date(s.created_at).toLocaleDateString('uk', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <p className="text-[var(--muted)] text-xs whitespace-nowrap">
                  до {new Date(s.expires_at).toLocaleDateString('uk', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
