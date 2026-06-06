"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerContainer } from "@/constants/motion";

const STATS = [
  { label: "Онлайн зараз",       value: "120+",   sub: "гравців на сервері",     color: "#4ade80" },
  { label: "Всього гравців",      value: "5 000+", sub: "за весь час",            color: "#60a5fa" },
  { label: "Днів роботи",        value: "730+",   sub: "стабільного аптайму",    color: "#c084fc" },
  { label: "Ивентів проведено",  value: "150+",   sub: "турнірів та подій",      color: "#fbbf24" },
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
    <section className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeInUp}
              className="relative p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: `radial-gradient(circle at 100% 0%, ${s.color}, transparent 60%)` }}
              />
              <div className="text-2xl sm:text-3xl font-black mb-0.5" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-sm font-semibold text-[var(--foreground)] mb-0.5">{s.label}</div>
              <div className="text-xs text-[var(--muted)]">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bar chart */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Онлайн за тиждень</p>
            <span className="text-xs text-[var(--muted)] bg-[var(--background)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
              пік: {MAX_VAL}
            </span>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-28 sm:h-36">
            {BAR_DATA.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] sm:text-xs text-[var(--muted)] font-mono tabular-nums">
                  {d.value}
                </span>
                <div className="w-full rounded-t-lg overflow-hidden" style={{ height: "100%" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${(d.value / MAX_VAL) * 100}%` } : { height: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-lg"
                    style={{
                      background: `linear-gradient(to top, #22c55e, #4ade80)`,
                      opacity: 0.55 + (d.value / MAX_VAL) * 0.45,
                    }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-[var(--muted)]">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
