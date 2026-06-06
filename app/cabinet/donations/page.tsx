import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Diamond, Clock } from 'lucide-react'

const tierInfo: Record<string, { label: string; color: string; icon: string }> = {
  vip:     { label: 'VIP',     color: 'text-yellow-400', icon: '⭐' },
  premium: { label: 'Premium', color: 'text-purple-400', icon: '💎' },
}

const statusInfo: Record<string, { label: string; color: string }> = {
  pending:  { label: 'Очікує',    color: 'text-yellow-400' },
  paid:     { label: 'Активний',  color: 'text-[var(--accent)]' },
  failed:   { label: 'Помилка',   color: 'text-red-400' },
  refunded: { label: 'Повернено', color: 'text-[var(--muted)]' },
}

export default async function DonationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const now = new Date()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Мої донати</h2>
        <Link
          href="/donate"
          className="px-4 py-2 bg-[var(--accent)] text-[#0f1117] font-semibold text-sm rounded-lg hover:bg-[var(--accent-dim)] transition-colors"
        >
          Задонатити
        </Link>
      </div>

      {!donations || donations.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <Diamond size={32} className="text-[var(--muted)] mx-auto mb-3" />
          <p className="text-[var(--muted)] mb-4">Ти ще не мав донатів</p>
          <Link href="/donate" className="inline-block px-5 py-2 bg-[var(--accent)] text-[#0f1117] font-semibold text-sm rounded-lg hover:bg-[var(--accent-dim)] transition-colors">
            Підтримати сервер
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => {
            const isActive = d.status === 'paid' && d.expires_at && new Date(d.expires_at) > now
            const daysLeft = d.expires_at
              ? Math.max(0, Math.ceil((new Date(d.expires_at).getTime() - now.getTime()) / 86400000))
              : null
            const tier = tierInfo[d.tier] ?? tierInfo.vip
            const status = statusInfo[d.status] ?? statusInfo.pending

            return (
              <div key={d.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <p className={`font-bold ${tier.color}`}>{tier.label}</p>
                      <p className="text-[var(--muted)] text-xs">{Number(d.amount_uah).toFixed(2)} ₴</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {isActive && daysLeft !== null && (
                  <div className="mt-3 flex items-center gap-1.5 text-[var(--accent)] text-xs">
                    <Clock size={12} />
                    <span>Залишилось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дні' : 'днів'}</span>
                  </div>
                )}

                {!isActive && d.status === 'paid' && (
                  <div className="mt-3">
                    <Link href="/donate" className="text-xs text-[var(--accent)] hover:underline">Продовжити →</Link>
                  </div>
                )}

                <p className="text-[var(--muted)] text-xs mt-2">
                  {new Date(d.created_at).toLocaleDateString('uk', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
