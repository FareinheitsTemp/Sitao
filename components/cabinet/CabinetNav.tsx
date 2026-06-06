'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useState } from 'react'

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  owner:   { label: 'Owner',   color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30' },
  admin:   { label: 'Admin',   color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  premium: { label: 'Premium', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
  vip:     { label: 'VIP',     color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  player:  { label: 'Player',  color: 'text-[var(--muted)]', bg: 'bg-[var(--surface-2)] border-[var(--border)]' },
}

const NAV_ITEMS = [
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
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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

type Profile = {
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
  const [loggingOut, setLoggingOut] = useState(false)
  const role = ROLE_META[profile.role] ?? ROLE_META.player

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Вийшли з акаунту')
    router.push('/')
    router.refresh()
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full md:w-64 shrink-0"
    >
      {/* Profile card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )
            }
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[var(--foreground)] text-sm truncate">
              {profile.display_name || profile.nickname}
            </p>
            <p className="text-[var(--muted)] text-xs truncate">@{profile.nickname}</p>
          </div>
        </div>
        <div className="mt-3">
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${role.bg} ${role.color}`}>
            {role.label}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 group ${
                active
                  ? 'text-[#4ade80] bg-[#4ade80]/5'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="cabinet-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#4ade80] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={active ? 'text-[#4ade80]' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'}>
                {icon}
              </span>
              {label}
            </Link>
          )
        })}

        <div className="border-t border-[var(--border)] mx-3" />

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--muted)] hover:text-red-400 hover:bg-red-400/5 transition-colors duration-150 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {loggingOut ? 'Виходимо...' : 'Вийти'}
        </button>
      </nav>
    </motion.aside>
  )
}
