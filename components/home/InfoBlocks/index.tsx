"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  IconNotes, IconUsers, IconBook, IconGift, IconArrowRight,
} from "@tabler/icons-react";

const BLOCKS = [
  { icon: IconNotes, num: "03", label: "Новини",   title: "Будь у курсі подій",     desc: "Оновлення, анонси івентів та оголошення від адміністрації.",    href: "/posts",  cta: "Читати новини" },
  { icon: IconUsers, num: "04", label: "Команда",  title: "Познайомся з персоналом", desc: "Всі адміністратори, модератори та технічний склад SITAO.",   href: "/staff",  cta: "Персонал" },
  { icon: IconBook,  num: "05", label: "Правила",  title: "Правила сервера",      desc: "Основа комфортного геймплею для всіх гравців.",        href: "/rules",  cta: "Читати" },
  { icon: IconGift,  num: "06", label: "Донат",    title: "Підтримай сервер",    desc: "Унікальні косметичні можливості, без p2w.",                href: "/donate", cta: "Переглянути" },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function InfoBlocks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-32 px-6 lg:px-8 border-t border-[var(--border)]" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
          <div>
            <motion.p
              custom={0} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-4"
            >
              03 — Розділи
            </motion.p>
            <motion.h2
              custom={1} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
            >
              Дізнайся більше<br />про SITAO
            </motion.h2>
          </div>
          <motion.p
            custom={2} variants={reveal} initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-sm text-[var(--muted-lt)] max-w-[220px] leading-relaxed"
          >
            Обері розділ, який тебе цікавить.
          </motion.p>
        </div>

        {/* Rows */}
        <motion.div custom={0} variants={reveal} initial="hidden" animate={inView ? "visible" : "hidden"} className="h-px bg-[var(--border)] mb-0" />

        <div>
          {BLOCKS.map(({ icon: Icon, num, label, title, desc, href, cta }, idx) => (
            <motion.div
              key={href}
              custom={idx + 3} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <Link
                href={href}
                className="group flex items-center gap-6 py-7 border-b border-[var(--border)] hover:bg-transparent transition-colors"
              >
                <span className="shrink-0 text-[10px] font-mono text-[var(--muted)] w-6 tabular-nums">{num}</span>

                <div className="shrink-0 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--border-lt)] transition-colors duration-200">
                  <Icon size={15} className="text-[var(--muted-lt)] group-hover:text-[var(--accent)] transition-colors duration-200" />
                </div>

                <div className="shrink-0 hidden sm:block">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">{label}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-200 mb-0.5">{title}</p>
                  <p className="text-sm text-[var(--muted-lt)] leading-relaxed hidden sm:block">{desc}</p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] group-hover:text-[var(--accent)] transition-all duration-200">
                  <span className="hidden sm:inline">{cta}</span>
                  <IconArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
