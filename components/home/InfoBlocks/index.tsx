"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { IconNotes, IconUsers, IconBook, IconGift, IconArrowUpRight } from "@tabler/icons-react";
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
  },
  {
    icon: IconUsers,
    label: "Команда",
    title: "Познайомся з командою",
    description: "Дізнайся хто стоїть за сервером — адміністратори, модератори та весь персонал SITAO.",
    href: "/staff",
    cta: "Переглянути персонал",
    accent: "#c084fc",
  },
  {
    icon: IconBook,
    label: "Правила",
    title: "Правила сервера",
    description: "Прочитай правила перед грою. Дотримання правил — основа комфортного геймплею для всіх.",
    href: "/rules",
    cta: "Читати правила",
    accent: "#fbbf24",
  },
  {
    icon: IconGift,
    label: "Донат",
    title: "Підтримай сервер",
    description: "Відкрий унікальні косметичні можливості та допоможи серверу продовжувати роботу.",
    href: "/donate",
    cta: "Переглянути донат",
    accent: "#4ade80",
  },
];

export default function InfoBlocks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-14"
        >
          <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#4ade80] mb-3">
            Розділи
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Дізнайся більше про SITAO
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {BLOCKS.map(({ icon: Icon, label, title, description, href, cta, accent }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="group relative p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Background accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20"
                style={{ background: accent, transform: "translate(30%, -30%)" }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${accent}18` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                    {label}
                  </span>
                </div>

                <h3 className="text-xl font-black mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{description}</p>

                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-150 hover:gap-2.5"
                  style={{ color: accent }}
                >
                  {cta}
                  <IconArrowUpRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
