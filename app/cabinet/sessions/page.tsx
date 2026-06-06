import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Monitor, AlertTriangle } from 'lucide-react'

const countryFlag = (code: string | null) => {
  if (!code) return '🌍'
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
          <Monitor size={32} className="text-[var(--muted)] mx-auto mb-3" />
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
                <div className="flex items-center gap-3">
                  <span className="text-xl">{countryFlag(s.country_code)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {s.country_code ?? 'Невідома країна'}
                      </p>
                      {s.is_suspicious && (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle size={12} /> Підозріло
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--muted)] text-xs">
                      {new Date(s.created_at).toLocaleDateString('uk', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <p className="text-[var(--muted)] text-xs">
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
