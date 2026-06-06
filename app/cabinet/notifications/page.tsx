import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const typeIcon = (type: string) => {
  const icons: Record<string, JSX.Element> = {
    ban: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    unban: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    system: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  }
  return icons[type] ?? icons.system
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Сповіщення</h2>
        {unreadCount > 0 && (
          <span className="bg-[var(--accent)] text-[#0f1117] text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <p className="text-[var(--muted)]">Сповіщень поки немає</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-[var(--surface)] border rounded-xl p-4 ${
                n.is_read ? 'border-[var(--border)] opacity-60' : 'border-[var(--accent)]/30 bg-[var(--accent)]/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 mt-0.5 ${n.is_read ? 'text-[var(--muted)]' : 'text-[var(--accent)]'}`}>
                  {typeIcon(n.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--foreground)] text-sm">{n.title}</p>
                  {n.body && <p className="text-[var(--muted)] text-xs mt-0.5">{n.body}</p>}
                  <p className="text-[var(--muted)] text-xs mt-1">
                    {new Date(n.created_at).toLocaleDateString('uk', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
