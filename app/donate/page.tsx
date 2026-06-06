"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import { DONATE_ITEMS } from "@/constants/donate";
import DonateCard from "@/components/donate/DonateCard";
import DonateModal from "@/components/donate/DonateModal";
import DonateFAQ from "@/components/donate/DonateFAQ";
import { IconBrandDiscord, IconExternalLink, IconSparkles } from "@tabler/icons-react";

type DonateItem = typeof DONATE_ITEMS[number];

export default function DonatePage() {
  const [selected, setSelected] = useState<DonateItem | null>(null);
  const monobank = process.env.NEXT_PUBLIC_MONOBANK_URL ?? "#";
  const discord  = process.env.NEXT_PUBLIC_DISCORD_URL ?? "#";

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
            <IconSparkles size={16} />
            Без pay-to-win — тільки косметика
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Підтримай{" "}
            <span className="text-[#4ade80]">SITAO</span>
          </h1>
          <p className="text-[var(--muted)] leading-relaxed max-w-md mx-auto text-sm sm:text-base">
            Донат допомагає серверу працювати та розвиватись. Натомість отримуєш
            унікальні косметичні можливості, які не дають ігрових переваг.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            {DONATE_ITEMS.map((item) => (
              <DonateCard
                key={item.id}
                item={item}
                onClick={() => setSelected(item as unknown as DonateItem)}
              />
            ))}
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 mb-6"
          >
            <h2 className="text-lg font-black mb-5 tracking-tight">Як зробити донат?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", text: "Обери позицію зі списку та натисни на картку" },
                { step: "02", text: "Переходь на Monobank та зроби переказ" },
                { step: "03", text: "Напиши адміністратору в Discord із скріншотом оплати" },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-3">
                  <span className="text-2xl font-black text-[#4ade80]/30 leading-none shrink-0">{step}</span>
                  <p className="text-sm text-[var(--muted)] leading-relaxed pt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <DonateFAQ />

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href={monobank}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl bg-[#4ade80] text-black font-bold hover:bg-[#22c55e] active:scale-[0.98] transition-all text-sm"
            >
              Задонатити через Monobank
              <IconExternalLink size={16} />
            </a>
            <a
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all text-sm font-medium"
            >
              <IconBrandDiscord size={18} />
              Зв&apos;язатись в Discord
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <DonateModal
            item={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
