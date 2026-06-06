'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const TIER_META: Record<string, { label: string; color: string; bg: string }> = {
  vip:     { label: 'VIP',     color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  premium: { label: 'Premium', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  paid:     { label: 'Активний', color: 'text-green-400' },
  pending:  { label: 'Очікує',   color: 'text-yellow-400' },
  failed:   { label: 'Помилка',  color: 'text-red-400' },
  refunded: { label: 'Повернено', color: 'text-[var(--muted)]' },
}

type Donation = {
  id: string
  tier: string
  amount_uah: number
  status: string
  expires_at: string | null
  created_at: string
}

export function DonationsList({ donations }: { donations: Donation[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Мої донати</h2>
        <Link
          href="/donate"
          className="text-xs px-3 py-1.5 rounded-lg bg-[var(--accent)] text-[#0f1117] font-bold hover:bg-[#22c55e] transition-colors"
        >
          Підтримати
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <p className="text-[var(--muted)] text-sm mb-1">Поки що донатів немає</p>
          <p className="text-xs text-[var(--muted)]">Підтримай сервер і отримай привілеї</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d, i) => {
            const tier = TIER_META[d.tier] ?? TIER_META.vip
            const status = STATUS_META[d.status] ?? STATUS_META.pending
            const date = new Date(d.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })
            const expires = d.expires_at
              ? new Date(d.expires_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })
              : null
            const isActive = d.status === 'paid' && (!d.expires_at || new Date(d.expires_at) > new Date())

            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4"
              >
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${tier.bg} ${tier.color}`}>
                  {tier.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                    {isActive && expires && (
                      <span className="text-xs text-[var(--muted)]">до {expires}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{date}</p>
                </div>
                <p className="text-sm font-bold text-[var(--foreground)] shrink-0">{Number(d.amount_uah).toFixed(0)} ₴</p>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
