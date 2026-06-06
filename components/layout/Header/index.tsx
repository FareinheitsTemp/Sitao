'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/',       label: 'Головна' },
  { href: '/posts',  label: 'Новини' },
  { href: '/staff',  label: 'Персонал' },
  { href: '/rules',  label: 'Правила' },
  { href: '/donate', label: 'Донат' },
]

const ROLE_COLOR: Record<string, string> = {
  owner:   'text-red-400',
  admin:   'text-orange-400',
  premium: 'text-purple-400',
  vip:     'text-yellow-400',
  player:  'text-[var(--muted)]',
}

type Profile = { nickname: string; display_name: string | null; avatar_url: string | null; role: string } | null
type User    = { id: string } | null

export default function Header({ user, profile }: { user: User; profile: Profile }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [open, setOpen]           = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [dropOpen, setDropOpen]   = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false); setDropOpen(false) }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const displayName = profile?.display_name || profile?.nickname || ''
  const roleColor   = ROLE_COLOR[profile?.role ?? 'player'] ?? ROLE_COLOR.player

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f1117]/90 backdrop-blur-xl border-b border-[var(--border)]'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 font-black text-lg tracking-tight shrink-0">
            <span className="text-[#4ade80]">SITAO</span>
            <span className="text-[var(--muted)]">.fun</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
              return (
                <Link key={href} href={href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'text-[var(--foreground)] bg-[var(--surface-2)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Auth zone desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user && profile ? (
              <div ref={dropRef} className="relative">
                {/* Avatar button */}
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[var(--surface)] transition-colors duration-150 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden flex items-center justify-center shrink-0">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xs font-bold text-[var(--muted)]">{displayName.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <span className={`text-sm font-semibold ${roleColor}`}>{displayName}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-[var(--muted)] transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden py-1.5">
                    <div className="px-4 py-2.5 border-b border-[var(--border)] mb-1">
                      <p className="text-xs font-semibold text-[var(--foreground)] truncate">{displayName}</p>
                      <p className="text-xs text-[var(--muted)] truncate">@{profile.nickname}</p>
                    </div>
                    <Link href="/cabinet/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      Особистий кабінет
                    </Link>
                    <Link href="/cabinet/notifications"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                      Сповіщення
                    </Link>
                    <div className="border-t border-[var(--border)] my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--muted)] hover:text-red-400 hover:bg-red-400/5 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all duration-150">
                  Увійти
                </Link>
                <Link href="/auth/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-[#4ade80] text-black hover:bg-[#22c55e] active:scale-95 transition-all duration-150">
                  Реєстрація
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-4 right-4 z-50 md:hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3 shadow-2xl">
            <div className="flex flex-col gap-1 mb-3">
              {NAV.map(({ href, label }) => {
                const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link key={href} href={href}
                    className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[var(--surface-2)] text-[#4ade80]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-[var(--border)] pt-3">
              {user && profile ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden flex items-center justify-center shrink-0">
                      {profile.avatar_url
                        ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-sm font-bold text-[var(--muted)]">{displayName.charAt(0).toUpperCase()}</span>
                      }
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${roleColor}`}>{displayName}</p>
                      <p className="text-xs text-[var(--muted)]">@{profile.nickname}</p>
                    </div>
                  </div>
                  <Link href="/cabinet/profile"
                    className="flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors">
                    Особистий кабінет
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-red-400 hover:bg-red-400/5 transition-colors">
                    Вийти
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/login"
                    className="py-2.5 text-center text-sm font-medium rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    Увійти
                  </Link>
                  <Link href="/auth/register"
                    className="py-2.5 text-center text-sm font-bold rounded-xl bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors">
                    Реєстрація
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
