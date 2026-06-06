"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  IconSword, IconUsers, IconMap, IconGift,
  IconShield, IconTrophy, IconBolt, IconHeart,
} from "@tabler/icons-react";
import { fadeInUp, staggerContainer } from "@/constants/motion";

const FEATURES = [
  { icon: IconSword,  title: "Унікальний геймплей",   description: "Власні механіки та плагіни, яких немає на інших серверах.",      color: "#4ade80" },
  { icon: IconUsers,  title: "Жива спільнота",         description: "Активний Discord, регулярні ивенти та дружня атмосфера.",          color: "#60a5fa" },
  { icon: IconShield, title: "Захист від гріферів",    description: "Клейми, швидка модерація та прозора система скарг.",               color: "#f472b6" },
  { icon: IconTrophy, title: "Рейтинги та нагороди",   description: "Топи гравців, сезонні турніри та ексклюзивні призи.",              color: "#fbbf24" },
  { icon: IconMap,    title: "Онлайн-карта",           description: "Dynmap у реальному часі — бачиш весь світ з браузера.",           color: "#34d399" },
  { icon: IconBolt,   title: "Стабільний сервер",      description: "Потужне залізо, мінімальні пінги та своєчасні апдейти.",          color: "#a78bfa" },
  { icon: IconGift,   title: "Донат без p2w",          description: "Тільки косметика — баланс гри залишається чистим.",               color: "#fb923c" },
  { icon: IconHeart,  title: "Підтримка гравців",      description: "Чуйна адміністрація та тікет-система для будь-яких питань.",      color: "#f43f5e" },
];

export default function FeatureScroll() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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
            Чому SITAO
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Все, що потрібно для крутої гри
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[var(--muted)] max-w-lg mx-auto text-sm sm:text-base">
            Ми вкладаємо душу в кожну деталь, щоб твій досвід був незабутнім.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="group relative p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/30 transition-all duration-300 overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}10, transparent 65%)` }}
              />
              <div
                className="inline-flex p-2.5 rounded-xl mb-4"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-bold text-sm mb-1.5 text-[var(--foreground)]">{title}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
