'use client'

import { motion } from 'framer-motion'

const ROLE_META: Record<string, { label: string; color: string; bg: string; glow: string }> = {
  owner:   { label: 'Owner',   color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30',       glow: 'shadow-red-400/20' },
  admin:   { label: 'Admin',   color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30', glow: 'shadow-orange-400/20' },
  premium: { label: 'Premium', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', glow: 'shadow-purple-400/20' },
  vip:     { label: 'VIP',     color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', glow: 'shadow-yellow-400/20' },
  player:  { label: 'Player',  color: 'text-[var(--muted)]', bg: 'bg-[var(--surface-2)] border-[var(--border)]', glow: '' },
}

type Profile = {
  nickname: string
  display_name: string | null
  avatar_url: string | null
  role: string
  play_time_hours: number
  total_kills: number
  total_deaths: number
  balance: number
  minecraft_name: string | null
  created_at: string
}

const STATS = (p: Profile) => [
  {
    label: 'Час гри',
    value: `${p.play_time_hours ?? 0}г`,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    color: 'text-blue-400',
  },
  {
    label: 'Вбивства',
    value: p.total_kills ?? 0,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        <path d="M9.5 14.5v-5c0-.83-.67-1.5-1.5-1.5S6.5 8.67 6.5 9.5v5"/>
        <path d="M3.5 10H5v-1.5C5 7.67 4.33 7 3.5 7S2 7.67 2 8.5 2.67 10 3.5 10z"/>
        <path d="M11.5 15H6l-2 6h14l-2-6h-4.5z"/>
      </svg>
    ),
    color: 'text-red-400',
  },
  {
    label: 'Смерті',
    value: p.total_deaths ?? 0,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 3.18-1.65 5.97-4.13 7.59L16 21H8l-.87-2.41A9.01 9.01 0 0 1 3 11a9 9 0 0 1 9-9z"/>
      </svg>
    ),
    color: 'text-[var(--muted)]',
  },
  {
    label: 'Баланс',
    value: `${Number(p.balance ?? 0).toFixed(2)} ₴`,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    color: 'text-[#4ade80]',
  },
]

export function ProfileHeader({ profile, email }: { profile: Profile; email: string }) {
  const role = ROLE_META[profile.role] ?? ROLE_META.player
  const stats = STATS(profile)
  const joinDate = new Date(profile.created_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden"
    >
      {/* Top gradient strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#4ade80]/60 via-[#4ade80] to-[#4ade80]/60" />

      <div className="p-6">
        {/* Avatar + info */}
        <div className="flex items-start gap-5">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className={`relative w-20 h-20 rounded-2xl bg-[var(--surface-2)] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 shadow-xl ${role.glow}`}
          >
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )
            }
          </motion.div>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-[var(--foreground)] truncate">
                {profile.display_name || profile.nickname}
              </h1>
              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border ${role.bg} ${role.color}`}>
                {role.label}
              </span>
            </div>

            <p className="text-[var(--muted)] text-sm mt-0.5">@{profile.nickname}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {email}
              </span>
              {profile.minecraft_name && (
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  {profile.minecraft_name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                З нами від {joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map(({ icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
              className="bg-[var(--surface-2)] rounded-xl p-3.5 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors"
            >
              <div className={`flex items-center gap-1.5 mb-1.5 ${color}`}>
                {icon}
                <span className="text-xs text-[var(--muted)]">{label}</span>
              </div>
              <p className="text-[var(--foreground)] font-bold text-base">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
