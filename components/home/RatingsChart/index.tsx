"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerContainer } from "@/constants/motion";
import { IconUsers, IconCalendar, IconTrophy, IconActivity } from "@tabler/icons-react";

const STATS = [
  { icon: IconActivity, label: "Онлайн зараз",      value: "120+",   sub: "гравців на сервері",   color: "#3d6bff" },
  { icon: IconUsers,    label: "Всього гравців",     value: "5 000+", sub: "за весь час",          color: "#60a5fa" },
  { icon: IconCalendar, label: "Днів роботи",        value: "730+",   sub: "стабільного аптайму",  color: "#c084fc" },
  { icon: IconTrophy,   label: "Ивентів проведено",  value: "150+",   sub: "турнірів та подій",    color: "#fbbf24" },
];

const BAR_DATA = [
  { day: "Пн", value: 72 },
  { day: "Вт", value: 85 },
  { day: "Ср", value: 91 },
  { day: "Чт", value: 78 },
  { day: "Пт", value: 110 },
  { day: "Сб", value: 135 },
  { day: "Нд", value: 120 },
];

const MAX_VAL = Math.max(...BAR_DATA.map((d) => d.value));

export default function RatingsChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 px-4 sm:px-6 relative" ref={ref}>
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#3d6bff] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#3d6bff] mb-3">
            Цифри
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Сервер у числах
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Stats column — left */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="lg:col-span-2 flex flex-col gap-3"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/30 transition-all duration-300 overflow-hidden relative"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 50%, ${s.color}10, transparent 70%)` }}
                />
                <div className="relative z-10 flex items-center gap-4 w-full">
                  <div className="shrink-0 p-2.5 rounded-xl" style={{ backgroundColor: `${s.color}15` }}>
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--muted)] mb-0.5">{s.label}</p>
                    <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)] text-right shrink-0 max-w-[80px] leading-tight">{s.sub}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bar chart — right */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="lg:col-span-3 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#3d6bff] mb-1">Тижневий онлайн</p>
                <p className="text-sm font-black text-[var(--foreground)]">Активність гравців</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[var(--foreground)]">{MAX_VAL}</p>
                <p className="text-xs text-[var(--muted)]">пік тижня</p>
              </div>
            </div>

            {/* Y-axis labels + bars */}
            <div className="flex gap-3 flex-1">
              {/* Y-axis */}
              <div className="flex flex-col justify-between pb-6 text-right">
                {[MAX_VAL, Math.round(MAX_VAL * 0.66), Math.round(MAX_VAL * 0.33), 0].map((v) => (
                  <span key={v} className="text-[10px] font-mono text-[var(--muted)]">{v}</span>
                ))}
              </div>

              {/* Bars */}
              <div className="flex items-end gap-2 sm:gap-3 flex-1" style={{ height: "160px" }}>
                {BAR_DATA.map((d, i) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full">
                    <div className="w-full rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: "100%" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={inView ? { height: `${(d.value / MAX_VAL) * 100}%` } : { height: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full rounded-t-lg relative group/bar cursor-default"
                        style={{
                          background: `linear-gradient(to top, #1a3a99, #3d6bff)`,
                          opacity: 0.5 + (d.value / MAX_VAL) * 0.5,
                        }}
                      >
                        {/* value tooltip on hover */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-[var(--surface-2)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] font-mono whitespace-nowrap">
                          {d.value}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-[var(--muted)]">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
