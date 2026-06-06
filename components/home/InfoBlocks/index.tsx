"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  IconNotes, IconUsers, IconBook, IconGift,
  IconArrowRight, IconSparkles,
} from "@tabler/icons-react";
import { fadeInUp, staggerContainer } from "@/constants/motion";

const BLOCKS = [
  {
    icon: IconNotes,
    label: "Новини",
    title: "Будь у курсі подій",
    description: "Оновлення сервера, анонси ивентів та оголошення від адміністрації — все в одному місці.",
    href: "/posts",
    cta: "Читати новини",
    accent: "#60a5fa",
    size: "large",
  },
  {
    icon: IconUsers,
    label: "Команда",
    title: "Познайомся з командою",
    description: "Дізнайся хто стоїть за сервером — адміністратори, модератори та весь персонал SITAO.",
    href: "/staff",
    cta: "Переглянути персонал",
    accent: "#c084fc",
    size: "small",
  },
  {
    icon: IconBook,
    label: "Правила",
    title: "Правила сервера",
    description: "Прочитай правила перед грою. Дотримання правил — основа комфортного геймплею для всіх.",
    href: "/rules",
    cta: "Читати правила",
    accent: "#fbbf24",
    size: "small",
  },
  {
    icon: IconGift,
    label: "Донат",
    title: "Підтримай сервер",
    description: "Відкрий унікальні косметичні можливості та допоможи серверу продовжувати роботу.",
    href: "/donate",
    cta: "Переглянути донат",
    accent: "#3d6bff",
    size: "large",
  },
];

export default function InfoBlocks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-28 px-4 sm:px-6 relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header — split layout like hero */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#3d6bff] mb-3">
              Розділи
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Дізнайся більше<br />про SITAO
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp} className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <IconSparkles size={14} className="text-[#3d6bff]" />
            <span>Обери розділ, який тебе цікавить</span>
          </motion.div>
        </motion.div>

        {/* Bento grid — 2 large + 2 small */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Large card 1 */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            {(() => {
              const b = BLOCKS[0];
              const Icon = b.icon;
              return (
                <Link
                  href={b.href}
                  className="group relative flex flex-col justify-between p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/25 transition-all duration-300 overflow-hidden h-full min-h-[200px]"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 0%, ${b.accent}12, transparent 65%)` }} />
                  <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-[0.07] pointer-events-none" style={{ background: b.accent, transform: "translate(25%, 25%)" }} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${b.accent}18` }}>
                        <Icon size={18} style={{ color: b.accent }} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: b.accent }}>{b.label}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-2 tracking-tight">{b.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm">{b.description}</p>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-200" style={{ color: b.accent }}>
                    {b.cta}
                    <IconArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })()}
          </motion.div>

          {/* Small card 1 */}
          <motion.div variants={fadeInUp}>
            {(() => {
              const b = BLOCKS[1];
              const Icon = b.icon;
              return (
                <Link
                  href={b.href}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/25 transition-all duration-300 overflow-hidden h-full min-h-[200px]"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 100% 0%, ${b.accent}12, transparent 65%)` }} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${b.accent}18` }}>
                        <Icon size={18} style={{ color: b.accent }} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: b.accent }}>{b.label}</span>
                    </div>
                    <h3 className="text-lg font-black mb-1.5 tracking-tight">{b.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{b.description}</p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-semibold transition-all duration-200" style={{ color: b.accent }}>
                    {b.cta}
                    <IconArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })()}
          </motion.div>

          {/* Small card 2 */}
          <motion.div variants={fadeInUp}>
            {(() => {
              const b = BLOCKS[2];
              const Icon = b.icon;
              return (
                <Link
                  href={b.href}
                  className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/25 transition-all duration-300 overflow-hidden h-full min-h-[200px]"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 100%, ${b.accent}12, transparent 65%)` }} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${b.accent}18` }}>
                        <Icon size={18} style={{ color: b.accent }} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: b.accent }}>{b.label}</span>
                    </div>
                    <h3 className="text-lg font-black mb-1.5 tracking-tight">{b.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{b.description}</p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-semibold transition-all duration-200" style={{ color: b.accent }}>
                    {b.cta}
                    <IconArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })()}
          </motion.div>

          {/* Large card 2 */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            {(() => {
              const b = BLOCKS[3];
              const Icon = b.icon;
              return (
                <Link
                  href={b.href}
                  className="group relative flex flex-col justify-between p-8 rounded-3xl bg-[var(--surface)] border border-[#3d6bff]/20 hover:border-[#3d6bff]/40 transition-all duration-300 overflow-hidden h-full min-h-[200px]"
                  style={{ background: "linear-gradient(135deg, rgba(61,107,255,0.06) 0%, rgba(13,20,40,0) 60%)" }}
                >
                  <div className="absolute inset-0 bg-[var(--surface)] -z-10" />
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-[0.08] pointer-events-none" style={{ background: b.accent, transform: "translate(30%, -30%)" }} />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${b.accent}18` }}>
                        <Icon size={18} style={{ color: b.accent }} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: b.accent }}>{b.label}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-2 tracking-tight">{b.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm">{b.description}</p>
                  </div>

                  <div className="relative z-10 mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white w-fit transition-all duration-150 active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #3d6bff 0%, #1a3a99 100%)", boxShadow: "0 0 20px rgba(61,107,255,0.3)" }}>
                    {b.cta}
                    <IconArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })()}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
