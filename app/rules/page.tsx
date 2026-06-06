"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import {
  IconBook, IconChevronDown, IconAlertTriangle,
  IconMessageCircle, IconSword, IconShield, IconUsers,
} from "@tabler/icons-react";

const RULE_CATEGORIES = [
  {
    id: "general",
    icon: IconShield,
    title: "Загальні правила",
    color: "#4ade80",
    rules: [
      { n: "1.1", text: "Поважай усіх гравців — образи, приниження та дискримінація заборонені." },
      { n: "1.2", text: "Будь-яке використання читів, хаків, експлойтів або дюп-багів суворо заборонено." },
      { n: "1.3", text: "Адміністрація залишає за собою право виносити рішення навіть у ситуаціях, не описаних у правилах." },
      { n: "1.4", text: "Незнання правил не звільняє від відповідальності." },
      { n: "1.5", text: "Будь-яка діяльність, що порушує законодавство України, суворо заборонена." },
    ],
  },
  {
    id: "chat",
    icon: IconMessageCircle,
    title: "Правила чату",
    color: "#60a5fa",
    rules: [
      { n: "2.1", text: "Спам, флуд та повторення одного й того ж повідомлення — заборонені." },
      { n: "2.2", text: "Реклама інших серверів та проектів у будь-якому вигляді заборонена." },
      { n: "2.3", text: "Ненормативна лексика в публічних каналах чату не допускається." },
      { n: "2.4", text: "Образи та погрози у бік гравців або адміністрації заборонені." },
      { n: "2.5", text: "Провокування конфліктів та навмисне поширення неправдивої інформації заборонено." },
    ],
  },
  {
    id: "gameplay",
    icon: IconSword,
    title: "Правила гри",
    color: "#f59e0b",
    rules: [
      { n: "3.1", text: "Гриферство, знищення чужих будівель та крадіжка майна — суворо заборонені." },
      { n: "3.2", text: "Вбивство гравців (PvP) дозволене лише у спеціально відведених зонах або за взаємною згодою." },
      { n: "3.3", text: "Заблокування спаунів мобів, нор та ресурсних точок для інших гравців заборонено." },
      { n: "3.4", text: "Будівництво непристойних конструкцій чи образливих написів заборонено." },
      { n: "3.5", text: "Торгівля в грі за реальні гроші поза офіційним магазином заборонена." },
    ],
  },
  {
    id: "staff",
    icon: IconUsers,
    title: "Взаємодія з персоналом",
    color: "#a78bfa",
    rules: [
      { n: "4.1", text: "Видавати себе за персонал сервера або використовувати схожі нікнейми заборонено." },
      { n: "4.2", text: "Підкуп персоналу або спроби домовитись про зняття бану/мута суворо заборонені." },
      { n: "4.3", text: "Виконуй законні вимоги персоналу. Незгоду висловлюй через апеляцію, а не суперечкою." },
      { n: "4.4", text: "Надавай правдиву інформацію при зверненні до персоналу." },
    ],
  },
  {
    id: "sanctions",
    icon: IconAlertTriangle,
    title: "Санкції та покарання",
    color: "#f87171",
    rules: [
      { n: "5.1", text: "За перше незначне порушення видається попередження (warn)." },
      { n: "5.2", text: "Повторні або грубі порушення тягнуть за собою тимчасове або постійне відключення (mute/ban)." },
      { n: "5.3", text: "Використання читів тягне за собою негайний постійний бан без попереджень." },
      { n: "5.4", text: "Оскарження рішень адміністрації можливе через Discord тікет-систему." },
      { n: "5.5", text: "Обхід бану (через alt-акаунти) тягне за собою розширення покарання." },
    ],
  },
];

function RuleCategory({ category, index }: { category: typeof RULE_CATEGORIES[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = category.icon;

  return (
    <motion.div variants={fadeInUp} className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group hover:bg-[var(--surface-2)]/40 transition-colors"
      >
        <div className="shrink-0 p-2.5 rounded-2xl" style={{ background: `${category.color}15` }}>
          <Icon size={22} style={{ color: category.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-base">{category.title}</span>
          <span className="ml-2 text-xs text-[var(--muted)]">{category.rules.length} правил</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 text-[var(--muted)]"
        >
          <IconChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)] px-5 sm:px-6 py-4 space-y-3.5">
              {category.rules.map((rule) => (
                <div key={rule.n} className="flex gap-3 group/rule">
                  <span
                    className="shrink-0 mt-0.5 text-xs font-black font-mono px-2 py-0.5 rounded-lg"
                    style={{ color: category.color, background: `${category.color}15` }}
                  >
                    {rule.n}
                  </span>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{rule.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RulesPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#4ade80] opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4ade80]/25 bg-[#4ade80]/8 text-[#4ade80] text-sm font-medium mb-6">
            <IconBook size={16} />
            Оновлено 2025
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Правила{" "}
            <span className="text-[#4ade80]">SITAO</span>
          </h1>
          <p className="text-[var(--muted)] leading-relaxed max-w-md mx-auto text-sm sm:text-base">
            Дотримання правил забезпечує комфортну гру для всіх. Порушення тягнуть за собою санкції відповідно до їхньої тяжкості.
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            {RULE_CATEGORIES.map((cat, i) => (
              <RuleCategory key={cat.id} category={cat} index={i} />
            ))}
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 p-5 rounded-2xl border border-[#f59e0b]/20 bg-[#f59e0b]/5 flex gap-3"
          >
            <IconAlertTriangle size={20} className="text-[#f59e0b] shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Правила можуть оновлюватись. Адміністрація повідомляє про зміни в Discord. Слідкуй за оголошеннями.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
