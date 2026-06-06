import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Bell, Check } from 'lucide-react'

const typeIcons: Record<string, string> = {
  ban:              '🔨',
  unban:            '✅',
  donate_activated: '💎',
  donate_expired:   '⏰',
  comment_reply:    '💬',
  system:           '📢',
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Сповіщення</h2>
          {unreadCount > 0 && (
            <span className="bg-[var(--accent)] text-[#0f1117] text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <Bell size={32} className="text-[var(--muted)] mx-auto mb-3" />
          <p className="text-[var(--muted)]">Сповіщень поки немає</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-[var(--surface)] border rounded-xl p-4 transition-colors ${
                n.is_read
                  ? 'border-[var(--border)] opacity-60'
                  : 'border-[var(--accent)]/30 bg-[var(--accent)]/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{typeIcons[n.type] ?? '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[var(--foreground)] text-sm">{n.title}</p>
                    {!n.is_read && <Check size={14} className="text-[var(--accent)] flex-shrink-0" />}
                  </div>
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
