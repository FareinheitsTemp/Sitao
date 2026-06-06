"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { IconNotes, IconUsers, IconGift, IconBook, IconMenu2, IconX, IconHome } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/",       label: "Головна",  icon: IconHome },
  { href: "/posts",  label: "Новини",   icon: IconNotes },
  { href: "/staff",  label: "Персонал", icon: IconUsers },
  { href: "/rules",  label: "Правила",  icon: IconBook },
  { href: "/donate", label: "Донат",    icon: IconGift },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
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
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-[var(--surface-2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth buttons */}
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
            className="md:hidden relative z-10 p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {open ? <IconX size={20} /> : <IconMenu2 size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 left-4 right-4 z-50 md:hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-3 shadow-2xl"
            >
              <div className="flex flex-col gap-1 mb-3">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-[var(--surface-2)] text-[#4ade80]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]/60"
                      }`}
                    >
                      <Icon size={18} />
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
