"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  IconSword, IconUsers, IconMap, IconGift,
  IconShield, IconTrophy, IconBolt, IconHeartHandshake,
} from "@tabler/icons-react";

const FEATURES = [
  { icon: IconSword,          title: "Унікальний геймплей",  desc: "Власні механіки та плагіни, яких немає на інших серверах." },
  { icon: IconUsers,          title: "Жива спільнота",       desc: "Активний Discord, регулярні івенти та дружня атмосфера." },
  { icon: IconShield,         title: "Захист від гріферів",   desc: "Клейми, швидка модерація та прозора система скарг." },
  { icon: IconTrophy,         title: "Рейтинги та нагороди",  desc: "Топи гравців, сезонні турніри та ексклюзивні призи." },
  { icon: IconMap,            title: "Онлайн-карта",          desc: "Dynmap у реальному часі — бачиш весь світ з браузера." },
  { icon: IconBolt,           title: "Стабільний сервер",      desc: "Потужне залізо, мінімальні пінги та своєчасні апдейти." },
  { icon: IconGift,           title: "Донат без p2w",         desc: "Тільки косметика — баланс гри залишається чистим." },
  { icon: IconHeartHandshake, title: "Підтримка гравців",    desc: "Чуйна адміністрація та тікет-система для будь-яких питань." },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function FeatureScroll() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-32 px-6 lg:px-8" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
          <div>
            <motion.p
              custom={0} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-4"
            >
              02 — Переваги
            </motion.p>
            <motion.h2
              custom={1} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
            >
              Все, що потрібно<br />для крутої гри
            </motion.h2>
          </div>
          <motion.p
            custom={2} variants={reveal} initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-sm text-[var(--muted-lt)] max-w-[260px] leading-relaxed"
          >
            Ми вкладаємо душу в кожну деталь, щоб твій досвід був незабутнім.
          </motion.p>
        </div>

        {/* Divider */}
        <motion.div
          custom={3} variants={reveal} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="h-px bg-[var(--border)] mb-0"
        />

        {/* Feature list — ponder-style rows */}
        <div>
          {FEATURES.map(({ icon: Icon, title, desc }, idx) => (
            <motion.div
              key={title}
              custom={idx + 4} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="group flex items-start gap-6 py-6 border-b border-[var(--border)] cursor-default"
            >
              <span className="shrink-0 text-[10px] font-mono text-[var(--muted)] w-6 mt-1 tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="shrink-0 mt-0.5 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] group-hover:border-[var(--border-lt)] transition-colors duration-200">
                <Icon size={15} className="text-[var(--muted-lt)] group-hover:text-[var(--accent)] transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors duration-200">{title}</h3>
                <p className="text-sm text-[var(--muted-lt)] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
