'use client'

import { motion } from 'framer-motion'

type Session = {
  id: string
  country_code: string | null
  is_suspicious: boolean
  created_at: string
  expires_at: string
}

export function SessionsList({ sessions }: { sessions: Session[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-lg font-bold text-[var(--foreground)]">Активні сесії</h2>
        <p className="text-xs text-[var(--muted)] mt-0.5">Останні входи до акаунту</p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <p className="text-[var(--muted)] text-sm">Сесій не знайдено</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s, i) => {
            const date = new Date(s.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            const expires = new Date(s.expires_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })
            const isExpired = new Date(s.expires_at) < new Date()

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  s.is_suspicious
                    ? 'bg-red-400/5 border-red-400/20'
                    : 'bg-[var(--surface)] border-[var(--border)]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  s.is_suspicious ? 'bg-red-400/10 text-red-400' : 'bg-[var(--surface-2)] text-[var(--muted)]'
                }`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--foreground)]">{date}</p>
                    {s.is_suspicious && (
                      <span className="text-xs text-red-400 font-semibold">Підозрілий</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {s.country_code ? `Країна: ${s.country_code}` : 'Країна невідома'}
                    {' · '}
                    {isExpired ? 'Завершено' : `Діє до ${expires}`}
                  </p>
                </div>

                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  isExpired ? 'bg-[var(--border)]' : s.is_suspicious ? 'bg-red-400' : 'bg-[#4ade80]'
                }`} />
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
