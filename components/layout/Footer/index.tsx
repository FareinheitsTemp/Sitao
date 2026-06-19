"use client";

import Link from "next/link";
import { IconBrandDiscord, IconBrandTiktok, IconMap } from "@tabler/icons-react";

const NAV = [
  { href: "/posts",  label: "Новини" },
  { href: "/rules",  label: "Правила" },
  { href: "/staff",  label: "Персонал" },
  { href: "/donate", label: "Донат" },
];

export default function Footer() {
  const discord = process.env.NEXT_PUBLIC_DISCORD_URL ?? "#";
  const tiktok  = process.env.NEXT_PUBLIC_TIKTOK_URL  ?? "#";
  const dynmap  = process.env.NEXT_PUBLIC_DYNMAP_URL  ?? "#";

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-10 gap-6 border-b border-[var(--border)]">
          <div>
            <p className="font-black text-sm tracking-tight mb-1">
              <span className="text-[var(--accent)]">SITAO</span>
              <span className="text-[var(--muted)]">.fun</span>
            </p>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs">
              Minecraft сервер з живою спільнотою.
            </p>
          </div>

          <nav className="flex items-center gap-6 flex-wrap">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <a href={discord} target="_blank" rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-150">
              <IconBrandDiscord size={16} />
            </a>
            <a href={tiktok} target="_blank" rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-150">
              <IconBrandTiktok size={16} />
            </a>
            <a href={dynmap} target="_blank" rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-150">
              <IconMap size={16} />
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-2">
          <p className="text-[10px] font-mono text-[var(--muted)]">
            © {new Date().getFullYear()} sitao.fun
          </p>
          <p className="text-[10px] font-mono text-[var(--muted)]">
            IP · sitao.fun
          </p>
        </div>
      </div>
    </footer>
  );
}
