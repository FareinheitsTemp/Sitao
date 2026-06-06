'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Bell, Diamond, Monitor, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const navItems = [
  { href: '/cabinet/profile',       label: 'Профіль',     icon: User },
  { href: '/cabinet/notifications',  label: 'Сповіщення',  icon: Bell },
  { href: '/cabinet/donations',      label: 'Донати',      icon: Diamond },
  { href: '/cabinet/sessions',       label: 'Сесії',       icon: Monitor },
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
      {/* User card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-lg flex-shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-lg" />
              : '🎮'
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

      {/* Nav */}
      <nav className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
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
              <Icon size={16} />
              {label}
            </Link>
          )
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Вийти
        </button>
      </nav>
    </aside>
  )
}
