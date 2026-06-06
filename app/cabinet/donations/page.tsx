import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const tierInfo: Record<string, { label: string; color: string }> = {
  vip:     { label: 'VIP',     color: 'text-yellow-400' },
  premium: { label: 'Premium', color: 'text-purple-400' },
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
        <Link href="/donate" className="px-4 py-2 bg-[var(--accent)] text-[#0f1117] font-semibold text-sm rounded-lg hover:bg-[var(--accent-dim)] transition-colors">
          Задонатити
        </Link>
      </div>

      {!donations || donations.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
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
            const tier   = tierInfo[d.tier]   ?? tierInfo.vip
            const status = statusInfo[d.status] ?? statusInfo.pending

            return (
              <div key={d.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className={`font-bold ${tier.color}`}>{tier.label}</p>
                    <p className="text-[var(--muted)] text-xs">{Number(d.amount_uah).toFixed(2)} ₴</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                {isActive && daysLeft !== null && (
                  <p className="mt-3 text-[var(--accent)] text-xs">
                    Залишилось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дні' : 'днів'}
                  </p>
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
