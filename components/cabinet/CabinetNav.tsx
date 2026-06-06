'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const navItems = [
  {
    href: '/cabinet/profile',
    label: 'Профіль',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    href: '/cabinet/notifications',
    label: 'Сповіщення',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    href: '/cabinet/donations',
    label: 'Донати',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    href: '/cabinet/sessions',
    label: 'Сесії',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
]

const roleLabels: Record<string, { label: string; color: string }> = {
  owner:   { label: 'Owner',   color: 'text-red-400' },
  admin:   { label: 'Admin',   color: 'text-orange-400' },
  premium: { label: 'Premium', color: 'text-purple-400' },
  vip:     { label: 'VIP',     color: 'text-yellow-400' },
  player:  { label: 'Player',  color: 'text-[var(--muted)]' },
}

interface Profile {
  id: string
  nickname: string
  display_name: string | null
  avatar_url: string | null
  role: string
  status: string
}

export function CabinetNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const role = roleLabels[profile.role] ?? roleLabels.player

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Ти вийшов з акаунту')
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )
            }
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--foreground)] text-sm truncate">
              {profile.display_name || profile.nickname}
            </p>
            <p className={`text-xs font-medium ${role.color}`}>{role.label}</p>
          </div>
        </div>
      </div>

      <nav className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-[var(--border)] last:border-0 ${
                active
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {icon}
              {label}
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Вийти
        </button>
      </nav>
    </aside>
  )
}
