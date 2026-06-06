"use client";

import Link from "next/link";
import { IconBrandDiscord, IconBrandTiktok, IconMap } from "@tabler/icons-react";

const LINKS = [
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
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-black text-base mb-3 tracking-tight">
              <span className="text-[#3d6bff]">SITAO</span>
              <span className="text-[var(--muted)]">.fun</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Minecraft сервер з живою спільнотою та якісним геймплеєм.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Навігація</p>
            <ul className="space-y-2">
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">Соцмережі</p>
            <div className="flex flex-col gap-2.5">
              <a href={discord} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[#5865F2] transition-colors">
                <IconBrandDiscord size={15} /> Discord
              </a>
              <a href={tiktok} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                <IconBrandTiktok size={15} /> TikTok
              </a>
              <a href={dynmap} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[#3d6bff] transition-colors">
                <IconMap size={15} /> Dynmap карта
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} sitao.fun — Всі права захищені
          </p>
          <p className="text-xs text-[var(--muted)]">
            IP: <span className="font-mono text-[var(--foreground)]/60">sitao.fun</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
