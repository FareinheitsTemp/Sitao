import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/components/cabinet/ProfileEditForm'
import { Shield, Clock, Swords, Skull, Coins } from 'lucide-react'

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
    { icon: Clock,  label: 'Час гри',    value: `${profile.play_time_hours}г` },
    { icon: Swords, label: 'Вбивства',   value: profile.total_kills },
    { icon: Skull,  label: 'Смерті',     value: profile.total_deaths },
    { icon: Coins,  label: 'Баланс',     value: `${Number(profile.balance).toFixed(2)} ₴` },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-2xl flex-shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover rounded-xl" />
              : '🎮'
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
              <p className="text-[var(--muted)] text-xs mt-1">⛏️ {profile.minecraft_name}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[var(--surface-2)] rounded-xl p-3 border border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-[var(--muted)] mb-1">
                <Icon size={14} />
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-[var(--foreground)] font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      <ProfileEditForm profile={profile} />
    </div>
  )
}
