"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import { DONATE_ITEMS } from "@/constants/donate";
import DonateFAQ from "@/components/donate/DonateFAQ";
import {
  IconBrandDiscord, IconExternalLink, IconSparkles,
  IconMusic, IconSword, IconArrowsVertical, IconChefHat,
  IconCheck, IconArrowRight, IconInfoCircle,
} from "@tabler/icons-react";

const ICON_MAP: Record<string, React.ElementType> = {
  MusicNote:      IconMusic,
  Sword:          IconSword,
  ArrowsVertical: IconArrowsVertical,
  Hat:            IconChefHat,
};

const ITEM_COLORS: Record<string, string> = {
  track:  "#a78bfa",
  sword:  "#f87171",
  height: "#60a5fa",
  hat:    "#fbbf24",
};

type DonateItem = typeof DONATE_ITEMS[number];

export default function DonatePage() {
  const [activeId, setActiveId] = useState<string>(DONATE_ITEMS[0].id);
  const monobank = process.env.NEXT_PUBLIC_MONOBANK_URL ?? "#";
  const discord  = process.env.NEXT_PUBLIC_DISCORD_URL ?? "#";

  const activeItem = DONATE_ITEMS.find((i) => i.id === activeId) ?? DONATE_ITEMS[0];
  const ActiveIcon = ICON_MAP[activeItem.icon] ?? IconSword;
  const activeColor = ITEM_COLORS[activeItem.id] ?? "#3d6bff";

  return (
    <div className="min-h-screen pt-16">

      {/* ── Hero ── */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #3d6bff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#3d6bff] opacity-[0.05] blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3d6bff]/30 bg-[rgba(61,107,255,0.08)] text-[#5b84ff] text-xs font-semibold tracking-wide uppercase">
                  <IconSparkles size={13} />
                  Без pay-to-win — тільки косметика
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Підтримай<br />
                <span style={{ background: "linear-gradient(135deg, #3d6bff 0%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>SITAO</span>
              </motion.h1>
            </div>
            <motion.p variants={fadeInUp} className="text-[var(--muted)] max-w-xs leading-relaxed text-sm lg:text-right">
              Донат допомагає серверу працювати та розвиватись. Натомість отримуєш унікальні косметичні можливості.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-10">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-mono text-[var(--muted)] px-2">{DONATE_ITEMS.length} позиції</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Main: Sidebar + Detail ── */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6 items-start">

            {/* ─ LEFT: Scrollable item list ─ */}
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-3 px-1">Обері позицію</p>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {DONATE_ITEMS.map((item) => {
                  const Icon = ICON_MAP[item.icon] ?? IconSword;
                  const color = ITEM_COLORS[item.id] ?? "#3d6bff";
                  const isActive = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className="group relative shrink-0 lg:shrink flex items-center gap-3 w-56 lg:w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-200"
                      style={isActive
                        ? { borderColor: `${color}40`, background: `${color}10` }
                        : { borderColor: "var(--border)", background: "var(--surface)" }
                      }
                    >
                      {/* active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: color }} />
                      )}
                      <div
                        className="shrink-0 p-2 rounded-xl transition-colors"
                        style={{ background: `${color}${isActive ? "20" : "12"}` }}
                      >
                        <Icon size={16} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate leading-tight transition-colors ${isActive ? "" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}`}
                          style={isActive ? { color } : {}}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-[var(--muted)] font-mono mt-0.5">{item.price} ₴</p>
                      </div>
                      {isActive && <IconArrowRight size={14} style={{ color }} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* How to donate — mini steps */}
              <div className="hidden lg:block mt-6 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">Як зробити донат?</p>
                {[
                  "Обері позицію зі списку",
                  "Перейди на Monobank",
                  "Напиши в Discord зі скріншотом",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-[#3d6bff]/15 text-[#3d6bff] text-[9px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─ RIGHT: Detail panel ─ */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-3xl bg-[var(--surface)] border overflow-hidden"
                  style={{ borderColor: `${activeColor}30` }}
                >
                  {/* top accent */}
                  <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${activeColor}, ${activeColor}50, transparent)` }} />

                  {/* ambient glow */}
                  <div className="absolute top-0 right-0 w-80 h-64 rounded-full blur-3xl opacity-[0.07] pointer-events-none" style={{ background: activeColor, transform: "translate(30%,-20%)" }} />

                  <div className="relative z-10 p-7 sm:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div
                          className="shrink-0 p-4 rounded-2xl"
                          style={{ background: `${activeColor}18`, boxShadow: `0 0 24px ${activeColor}20` }}
                        >
                          <ActiveIcon size={32} style={{ color: activeColor }} />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{activeItem.title}</h2>
                          <p className="text-xs text-[var(--muted)] mt-1 font-mono uppercase tracking-widest">Косметика · Без p2w</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-3xl font-black" style={{ color: activeColor }}>{activeItem.price} ₴</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">одноразовий платіж</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-base text-[var(--muted)] leading-relaxed mb-6">
                      {activeItem.description}
                    </p>

                    {/* Details badge */}
                    {activeItem.details && (
                      <div
                        className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-8 border"
                        style={{ background: `${activeColor}0a`, borderColor: `${activeColor}25` }}
                      >
                        <IconInfoCircle size={15} style={{ color: activeColor }} className="shrink-0 mt-0.5" />
                        <p className="text-sm" style={{ color: activeColor }}>{activeItem.details}</p>
                      </div>
                    )}

                    {/* Included */}
                    <div className="mb-8">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">Входить у набір</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Косметична одиниця",
                          "Без ігрових переваг",
                          "Навічне видалення адміном",
                          "Підтримка розвитку сервера",
                        ].map((feat) => (
                          <div key={feat} className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                            <IconCheck size={14} style={{ color: activeColor }} className="shrink-0" />
                            <span className="text-sm text-[var(--muted)]">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={monobank}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl font-bold text-sm text-white active:scale-[0.98] transition-all"
                        style={{ background: `linear-gradient(135deg, ${activeColor}, ${activeColor}aa)`, boxShadow: `0 0 24px ${activeColor}35` }}
                      >
                        Задонатити через Monobank
                        <IconExternalLink size={15} />
                      </a>
                      <a
                        href={discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium hover:border-[var(--muted)]/40 active:scale-[0.98] transition-all"
                      >
                        <IconBrandDiscord size={17} />
                        Discord
                      </a>
                    </div>

                    <p className="mt-4 text-xs text-[var(--muted)] text-center">
                      Після оплати напиши адміністратору в Discord зі скріншотом підтвердження.
                    </p>
                  </div>

                  {/* Other items — quick switch row */}
                  <div className="border-t border-[var(--border)] px-7 sm:px-8 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">Інші позиції</p>
                    <div className="flex gap-2 flex-wrap">
                      {DONATE_ITEMS.filter((i) => i.id !== activeItem.id).map((item) => {
                        const Icon = ICON_MAP[item.icon] ?? IconSword;
                        const color = ITEM_COLORS[item.id] ?? "#3d6bff";
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveId(item.id)}
                            className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--muted)]/30 transition-all duration-150"
                          >
                            <Icon size={13} style={{ color }} />
                            <span className="text-xs font-semibold text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">{item.title}</span>
                            <span className="text-xs font-mono text-[var(--muted)]/60">{item.price} ₴</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* FAQ below detail */}
              <div className="mt-6">
                <DonateFAQ />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
