"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconMap, IconBrandDiscord, IconCopy, IconCheck } from "@tabler/icons-react";
import { fadeInUp, staggerContainer, fadeIn } from "@/constants/motion";
import { useState } from "react";

const SERVER_IP = "sitao.fun";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const discord = process.env.NEXT_PUBLIC_DISCORD_URL ?? "#";
  const dynmap  = process.env.NEXT_PUBLIC_DYNMAP_URL  ?? "#";

  function copyIp() {
    navigator.clipboard?.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Dot grid bg */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Multiple glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#4ade80] opacity-[0.05] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#60a5fa] opacity-[0.04] blur-[120px] pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Online badge */}
        <motion.div variants={fadeInUp} className="mb-8 inline-flex">
          <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#4ade80]/25 bg-[rgba(74,222,128,0.08)] text-[#4ade80] text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
            </span>
            Сервер онлайн · sitao.fun
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]"
        >
          Твій{" "}
          <span className="relative inline-block">
            <span className="text-[#4ade80]">Minecraft</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#4ade80]/50 rounded-full origin-left"
            />
          </span>
          {" "}дім
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Сервер з живою спільнотою, власними механіками та атмосферою, яка запам'ятовується. Заходь — і побач сам.
        </motion.p>

        {/* IP copy */}
        <motion.div variants={fadeInUp} className="mb-10 flex justify-center">
          <button
            onClick={copyIp}
            className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#4ade80]/40 transition-all duration-200"
          >
            <span className="text-[var(--muted)] text-sm">IP:</span>
            <span className="font-mono font-bold text-[var(--foreground)] text-base">{SERVER_IP}</span>
            <span className={`transition-all duration-200 ${copied ? "text-[#4ade80]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}`}>
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </span>
            {copied && (
              <span className="text-xs text-[#4ade80] font-medium">Скопійовано!</span>
            )}
          </button>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#4ade80] text-black font-bold hover:bg-[#22c55e] active:scale-[0.98] transition-all duration-150 w-full sm:w-auto justify-center text-sm"
          >
            <IconBrandDiscord size={20} />
            Приєднатись до Discord
          </a>
          <a
            href={dynmap}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--muted)]/50 hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all duration-150 w-full sm:w-auto justify-center text-sm font-medium"
          >
            <IconMap size={20} />
            Онлайн-карта
          </a>
          <Link
            href="/donate"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] active:scale-[0.98] transition-all duration-150 w-full sm:w-auto justify-center text-sm font-medium"
          >
            Донат
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[var(--border)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
