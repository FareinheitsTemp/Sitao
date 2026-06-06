"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconHome, IconArrowLeft } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#4ade80] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[clamp(6rem,20vw,12rem)] font-black leading-none tracking-tighter select-none"
            style={{
              background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-2xl font-black tracking-tight mb-3">Сторінку не знайдено</h1>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Схоже, ця сторінка загубилась у Нижньому Світі. Повернись на головну і починай заново.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4ade80] text-black font-bold hover:bg-[#22c55e] active:scale-[0.98] transition-all text-sm"
            >
              <IconHome size={17} />
              На головну
            </Link>
            <button
              onClick={() => history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all text-sm font-medium"
            >
              <IconArrowLeft size={17} />
              Назад
            </button>
          </div>
        </motion.div>

        {/* Creeper emoji decoration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-4xl select-none"
          title="Не вибухнуло, але сторінки нема"
        >
          🌿
        </motion.div>
      </div>
    </div>
  );
}
