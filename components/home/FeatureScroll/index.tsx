"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  IconSword, IconUsers, IconMap, IconGift,
  IconShield, IconTrophy, IconBolt, IconHeartHandshake,
} from "@tabler/icons-react";
import { fadeInUp, staggerContainer } from "@/constants/motion";

const FEATURES = [
  { icon: IconSword,           title: "Унікальний геймплей",   description: "Власні механіки та плагіни, яких немає на інших серверах.",   color: "#3d6bff" },
  { icon: IconUsers,           title: "Жива спільнота",         description: "Активний Discord, регулярні ивенти та дружня атмосфера.",       color: "#60a5fa" },
  { icon: IconShield,          title: "Захист від гріферів",    description: "Клейми, швидка модерація та прозора система скарг.",           color: "#f472b6" },
  { icon: IconTrophy,          title: "Рейтинги та нагороди",   description: "Топи гравців, сезонні турніри та ексклюзивні призи.",          color: "#fbbf24" },
  { icon: IconMap,             title: "Онлайн-карта",           description: "Dynmap у реальному часі — бачиш весь світ з браузера.",        color: "#22d3ee" },
  { icon: IconBolt,            title: "Стабільний сервер",      description: "Потужне залізо, мінімальні пінги та своєчасні апдейти.",      color: "#a78bfa" },
  { icon: IconGift,            title: "Донат без p2w",          description: "Тільки косметика — баланс гри залишається чистим.",           color: "#fb923c" },
  { icon: IconHeartHandshake,  title: "Підтримка гравців",      description: "Чуйна адміністрація та тікет-система для будь-яких питань.",  color: "#f43f5e" },
];

export default function FeatureScroll() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 px-4 sm:px-6 relative overflow-hidden" ref={ref}>
      {/* subtle diagonal stripe bg */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #3d6bff 0px, #3d6bff 1px, transparent 1px, transparent 60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-[#3d6bff] mb-3">
                Чому SITAO
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-lg">
                Все, що потрібно<br />для крутої гри
              </motion.h2>
            </div>
            <motion.p variants={fadeInUp} className="text-[var(--muted)] max-w-xs text-sm leading-relaxed lg:text-right">
              Ми вкладаємо душу в кожну деталь, щоб твій досвід був незабутнім.
            </motion.p>
          </div>

          {/* Divider line with number */}
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-8">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-mono text-[var(--muted)] px-2">08 переваг</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </motion.div>
        </motion.div>

        {/* Feature grid — alternating large/small */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden"
        >
          {FEATURES.map(({ icon: Icon, title, description, color }, idx) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="group relative p-6 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-all duration-300 overflow-hidden cursor-default"
            >
              {/* Index number watermark */}
              <span
                className="absolute -top-2 -right-1 text-[4rem] font-black leading-none select-none pointer-events-none"
                style={{ color: `${color}08` }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 100%, ${color}12, transparent 65%)` }}
              />

              <div className="relative z-10">
                <div className="inline-flex p-2.5 rounded-xl mb-5" style={{ backgroundColor: `${color}15` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-bold text-sm mb-2 text-[var(--foreground)]">{title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{description}</p>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
