import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/components/cabinet/ProfileEditForm'

const roleLabels: Record<string, { label: string; color: string }> = {
  owner:   { label: 'Owner',   color: 'text-red-400' },
  admin:   { label: 'Admin',   color: 'text-orange-400' },
  premium: { label: 'Premium', color: 'text-purple-400' },
  vip:     { label: 'VIP',     color: 'text-yellow-400' },
  player:  { label: 'Player',  color: 'text-[var(--muted)]' },
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const role = roleLabels[profile.role] ?? roleLabels.player

  const stats = [
    {
      label: 'Час гри',
      value: `${profile.play_time_hours ?? 0}г`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: 'Вбивства',
      value: profile.total_kills ?? 0,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
    },
    {
      label: 'Смерті',
      value: profile.total_deaths ?? 0,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a9 9 0 0 1 9 9c0 3.18-1.65 5.97-4.13 7.59L16 21H8l-.87-2.41A9.01 9.01 0 0 1 3 11a9 9 0 0 1 9-9z"/>
          <line x1="9" y1="12" x2="9" y2="12"/>
          <line x1="15" y1="12" x2="15" y2="12"/>
        </svg>
      ),
    },
    {
      label: 'Баланс',
      value: `${Number(profile.balance ?? 0).toFixed(2)} ₴`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[var(--foreground)] truncate">
                {profile.display_name || profile.nickname}
              </h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] ${role.color}`}>
                {role.label}
              </span>
            </div>
            <p className="text-[var(--muted)] text-sm mt-0.5">@{profile.nickname}</p>
            {profile.minecraft_name && (
              <p className="text-[var(--muted)] text-xs mt-1">MC: {profile.minecraft_name}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="bg-[var(--surface-2)] rounded-xl p-3 border border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--muted)] mb-1">
                {icon}
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-[var(--foreground)] font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <ProfileEditForm profile={profile} />
    </div>
  )
}
