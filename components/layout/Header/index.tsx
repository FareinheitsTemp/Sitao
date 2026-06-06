"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/",       label: "Головна" },
  { href: "/posts",  label: "Новини" },
  { href: "/staff",  label: "Персонал" },
  { href: "/rules",  label: "Правила" },
  { href: "/donate", label: "Донат" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0f1117]/90 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 font-black text-lg tracking-tight shrink-0">
            <span className="text-[#4ade80]">SITAO</span>
            <span className="text-[var(--muted)]">.fun</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "text-[var(--foreground)] bg-[var(--surface-2)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth buttons desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all duration-150"
            >
              Увійти
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded-xl text-sm font-bold bg-[#4ade80] text-black hover:bg-[#22c55e] active:scale-95 transition-all duration-150"
            >
              Реєстрація
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-16 left-4 right-4 z-50 md:hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3 shadow-2xl">
            <div className="flex flex-col gap-1 mb-3">
              {NAV.map(({ href, label }) => {
                const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--surface-2)] text-[#4ade80]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-[var(--border)] pt-3 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                className="py-2.5 text-center text-sm font-medium rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Увійти
              </Link>
              <Link
                href="/auth/register"
                className="py-2.5 text-center text-sm font-bold rounded-xl bg-[#4ade80] text-black hover:bg-[#22c55e] transition-colors"
              >
                Реєстрація
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
