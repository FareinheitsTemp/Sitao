'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const TYPE_META: Record<string, { icon: React.ReactNode; color: string }> = {
  ban: {
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
  },
  unban: {
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  donate_activated: {
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  donate_expired: {
    color: 'text-[var(--muted)] bg-[var(--surface-2)] border-[var(--border)]',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  comment_reply: {
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  system: {
    color: 'text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
}

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  is_read: boolean
  created_at: string
}

export function NotificationsList({ notifications, userId }: { notifications: Notification[]; userId: string }) {
  const router = useRouter()
  const [items, setItems] = useState(notifications)

  const markAllRead = async () => {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setItems(prev => prev.map(n => ({ ...n, is_read: true })))
    toast.success('Всі сповіщення прочитано')
    router.refresh()
  }

  const markRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setItems(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const unreadCount = items.filter(n => !n.is_read).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">Сповіщення</h2>
          {unreadCount > 0 && (
            <p className="text-xs text-[var(--muted)] mt-0.5">{unreadCount} непрочитаних</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-[var(--accent)] hover:underline font-medium"
          >
            Прочитати всі
          </button>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <p className="text-[var(--muted)] text-sm">Поки що немає сповіщень</p>
            </motion.div>
          ) : (
            items.map((n, i) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.system
              const date = new Date(n.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={`flex gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    n.is_read
                      ? 'bg-[var(--surface)] border-[var(--border)] opacity-60'
                      : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)]/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${n.is_read ? 'text-[var(--muted)]' : 'text-[var(--foreground)]'}`}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />}
                        <span className="text-xs text-[var(--muted)] whitespace-nowrap">{date}</span>
                      </div>
                    </div>
                    {n.body && <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{n.body}</p>}
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
