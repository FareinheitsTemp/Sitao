"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconBrandDiscord, IconCopy, IconCheck, IconMap } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

const SERVER_IP = "sitao.fun";

const TIMELINE = [
  { year: "2022", label: "Запуск сервера",        detail: "Перший запуск SITAO.fun — 12 гравців online",                  y: 78 },
  { year: "2023", label: "Спільнота зростає",      detail: "Discord досяг 500 учасників, перший великий ивент",             y: 52 },
  { year: "2024", label: "Великий апдейт",         detail: "Нові плагіни, клейм-система та рейтинги гравців",               y: 30 },
  { year: "2025", label: "5 000 гравців",          detail: "Milestone: 5к унікальних гравців за весь час",                  y: 14 },
  { year: "2026", label: "Зараз · 120+ online",    detail: "Сервер живе, розвивається і чекає на тебе",                    y: 8  },
];

const W = 480;
const H = 220;
const PAD_X = 40;
const PAD_Y = 20;
const chartW = W - PAD_X * 2;
const chartH = H - PAD_Y * 2;

function xOf(i: number) {
  return PAD_X + (i / (TIMELINE.length - 1)) * chartW;
}
function yOf(pct: number) {
  return PAD_Y + (pct / 100) * chartH;
}

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const discord = process.env.NEXT_PUBLIC_DISCORD_URL ?? "#";
  const dynmap  = process.env.NEXT_PUBLIC_DYNMAP_URL  ?? "#";

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    let start: number | null = null;
    const duration = 2200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  function copyIp() {
    navigator.clipboard?.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pts = TIMELINE.map((t, i) => ({ x: xOf(i), y: yOf(t.y) }));

  function buildPath(ratio: number) {
    if (ratio <= 0 || pts.length < 2) return "";
    const totalLen = TIMELINE.length - 1;
    const drawn = ratio * totalLen;
    const full = Math.floor(drawn);
    const frac = drawn - full;

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < full && i < pts.length - 1; i++) {
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
      const cp1y = pts[i].y;
      const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) * 0.5;
      const cp2y = pts[i + 1].y;
      d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    if (full < pts.length - 1 && frac > 0) {
      const i = full;
      const nx = pts[i].x + (pts[i + 1].x - pts[i].x) * frac;
      const ny = pts[i].y + (pts[i + 1].y - pts[i].y) * frac;
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
      const cp1y = pts[i].y;
      const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) * 0.5;
      const cp2y = pts[i + 1].y;
      const t2 = frac;
      const bx = (1-t2)**3*pts[i].x + 3*(1-t2)**2*t2*cp1x + 3*(1-t2)*t2**2*cp2x + t2**3*pts[i+1].x;
      const by = (1-t2)**3*pts[i].y + 3*(1-t2)**2*t2*cp1y + 3*(1-t2)*t2**2*cp2y + t2**3*pts[i+1].y;
      d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${bx} ${by}`;
    }
    return d;
  }

  function buildAreaPath(ratio: number) {
    const linePath = buildPath(ratio);
    if (!linePath) return "";
    const totalLen = TIMELINE.length - 1;
    const drawn = ratio * totalLen;
    const full = Math.floor(Math.min(drawn, totalLen));
    const frac = drawn - full;
    let endX: number, endY: number;
    if (full >= totalLen) {
      endX = pts[pts.length - 1].x;
      endY = pts[pts.length - 1].y;
    } else {
      const i = full;
      const t2 = frac;
      const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
      const cp1y = pts[i].y;
      const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) * 0.5;
      const cp2y = pts[i + 1].y;
      endX = (1-t2)**3*pts[i].x + 3*(1-t2)**2*t2*cp1x + 3*(1-t2)*t2**2*cp2x + t2**3*pts[i+1].x;
      endY = (1-t2)**3*pts[i].y + 3*(1-t2)**2*t2*cp1y + 3*(1-t2)*t2**2*cp2y + t2**3*pts[i+1].y;
    }
    return `${linePath} L ${endX} ${H - PAD_Y} L ${pts[0].x} ${H - PAD_Y} Z`;
  }

  const drawnPtsCount = Math.floor(progress * (TIMELINE.length - 1));
  const lastDrawnIdx = Math.min(drawnPtsCount, TIMELINE.length - 1);
  const headX = progress >= 1 ? pts[pts.length-1].x : (() => {
    const full = Math.floor(progress * (TIMELINE.length-1));
    const frac = progress * (TIMELINE.length-1) - full;
    if (full >= TIMELINE.length-1) return pts[pts.length-1].x;
    const i = full;
    const cp1x = pts[i].x + (pts[i+1].x - pts[i].x) * 0.5;
    const cp1y = pts[i].y;
    const cp2x = pts[i+1].x - (pts[i+1].x - pts[i].x) * 0.5;
    const cp2y = pts[i+1].y;
    return (1-frac)**3*pts[i].x + 3*(1-frac)**2*frac*cp1x + 3*(1-frac)*frac**2*cp2x + frac**3*pts[i+1].x;
  })();
  const headY = progress >= 1 ? pts[pts.length-1].y : (() => {
    const full = Math.floor(progress * (TIMELINE.length-1));
    const frac = progress * (TIMELINE.length-1) - full;
    if (full >= TIMELINE.length-1) return pts[pts.length-1].y;
    const i = full;
    const cp1y = pts[i].y;
    const cp2y = pts[i+1].y;
    const cp1x = pts[i].x + (pts[i+1].x - pts[i].x) * 0.5;
    const cp2x = pts[i+1].x - (pts[i+1].x - pts[i].x) * 0.5;
    return (1-frac)**3*pts[i].y + 3*(1-frac)**2*frac*cp1y + 3*(1-frac)*frac**2*cp2y + frac**3*pts[i+1].y;
  })();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* ── Background effects ── */}
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #3d6bff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#3d6bff] opacity-[0.06] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-[#22d3ee] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-4rem)] py-16">

          {/* ── LEFT COLUMN ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16,1,0.3,1] } } }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#3d6bff]/30 bg-[rgba(61,107,255,0.08)] text-[#5b84ff] text-xs font-semibold tracking-wide uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3d6bff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3d6bff]" />
                </span>
                Сервер онлайн · sitao.fun
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16,1,0.3,1] } } }}
              className="mb-6"
            >
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.02]">
                Твій
                <br />
                <span
                  className=""
                  style={{
                    background: "linear-gradient(135deg, #3d6bff 0%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Minecraft
                </span>
                <br />
                дім
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16,1,0.3,1] } } }}
              className="text-base sm:text-lg text-[var(--muted)] max-w-md mb-8 leading-relaxed"
            >
              Сервер з живою спільнотою, власними механіками та атмосферою,
              яка запам&apos;ятовується.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16,1,0.3,1] } } }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <a
                href={discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-150 active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg, #3d6bff 0%, #1a3a99 100%)", boxShadow: "0 0 24px rgba(61,107,255,0.35)" }}
              >
                <IconBrandDiscord size={18} />
                Приєднатись
              </a>
              <a
                href={dynmap}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-medium border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-2)] hover:border-[var(--border-lt)] transition-all duration-150 active:scale-[0.97]"
              >
                <IconMap size={18} />
                Карта
              </a>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-all duration-150 active:scale-[0.97]"
              >
                Донат
              </Link>
            </motion.div>

            {/* IP copy + trusted */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={copyIp}
                className="group inline-flex items-center gap-3 w-fit px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#3d6bff]/40 transition-all duration-200"
              >
                <span className="text-[var(--muted)] text-xs font-medium">IP:</span>
                <span className="font-mono font-bold text-[var(--foreground)] text-sm">{SERVER_IP}</span>
                <span className={`transition-colors duration-200 ${copied ? "text-[#3d6bff]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"}`}>
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </span>
                {copied && <span className="text-xs text-[#3d6bff] font-medium">Скопійовано!</span>}
              </button>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs text-[var(--muted)] font-medium">Довіряють:</span>
                {["120+ гравців", "5к+ за всі часи", "730+ днів роботи"].map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--muted-lt)]">{t}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Timeline Graph ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center relative"
          >
            {/* Card */}
            <div
              className="relative w-full max-w-lg rounded-3xl border border-[var(--border)] overflow-hidden"
              style={{ background: "rgba(13,20,40,0.7)", backdropFilter: "blur(16px)", boxShadow: "0 0 60px rgba(61,107,255,0.12), 0 32px 64px rgba(0,0,0,0.4)" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#3d6bff] mb-0.5">Активність сервера</p>
                  <p className="text-sm font-black text-[var(--foreground)]">Історія SITAO · 2022 – 2026</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3d6bff]/80" />
                </div>
              </div>

              {/* SVG Chart */}
              <div className="px-4 pt-4 pb-2">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${W} ${H}`}
                  width="100%"
                  className="overflow-visible"
                  style={{ display: "block" }}
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1a3a99" />
                      <stop offset="100%" stopColor="#3d6bff" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d6bff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3d6bff" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0.25, 0.5, 0.75].map((f, i) => (
                    <line
                      key={i}
                      x1={PAD_X} y1={PAD_Y + f * chartH}
                      x2={W - PAD_X} y2={PAD_Y + f * chartH}
                      stroke="rgba(61,107,255,0.08)" strokeWidth="1"
                    />
                  ))}

                  {/* Area fill */}
                  {progress > 0 && (
                    <path
                      d={buildAreaPath(progress)}
                      fill="url(#areaGrad)"
                    />
                  )}

                  {/* Main line */}
                  {progress > 0 && (
                    <path
                      d={buildPath(progress)}
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Glow line duplicate */}
                  {progress > 0 && (
                    <path
                      d={buildPath(progress)}
                      fill="none"
                      stroke="rgba(61,107,255,0.4)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      style={{ filter: "blur(4px)" }}
                    />
                  )}

                  {/* Milestone dots */}
                  {TIMELINE.map((t, i) => {
                    const dotProgress = i / (TIMELINE.length - 1);
                    const visible = progress >= dotProgress - 0.02;
                    return visible ? (
                      <g
                        key={i}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseLeave={() => setActiveIdx(null)}
                      >
                        <circle cx={pts[i].x} cy={pts[i].y} r={16} fill="transparent" />
                        <circle
                          cx={pts[i].x} cy={pts[i].y} r={5}
                          fill={activeIdx === i ? "#5b84ff" : "#3d6bff"}
                          stroke={activeIdx === i ? "rgba(91,132,255,0.5)" : "rgba(61,107,255,0.3)"}
                          strokeWidth={activeIdx === i ? "8" : "4"}
                          style={{ filter: "url(#glow)", transition: "all 0.2s" }}
                        />
                        {/* Year label below */}
                        <text
                          x={pts[i].x} y={H - 2}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill={activeIdx === i ? "#5b84ff" : "rgba(74,95,138,0.9)"}
                          style={{ transition: "fill 0.2s", fontFamily: "var(--font-geist-mono, monospace)" }}
                        >
                          {t.year}
                        </text>
                      </g>
                    ) : null;
                  })}

                  {/* Animated head dot */}
                  {progress > 0 && progress < 1 && (
                    <>
                      <circle cx={headX} cy={headY} r={8} fill="rgba(61,107,255,0.2)">
                        <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={headX} cy={headY} r={4} fill="#3d6bff" filter="url(#glow)" />
                    </>
                  )}
                </svg>
              </div>

              {/* Tooltip */}
              <div className="px-6 pb-5 min-h-[60px]">
                <AnimatePresence mode="wait">
                  {activeIdx !== null ? (
                    <motion.div
                      key={activeIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#3d6bff]">{TIMELINE[activeIdx].year}</span>
                        <span className="text-sm font-bold text-[var(--foreground)]">{TIMELINE[activeIdx].label}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">{TIMELINE[activeIdx].detail}</p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-[var(--muted)] italic"
                    >
                      Наведи на точку, щоб дізнатись більше про цей момент
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom stats row */}
              <div className="grid grid-cols-3 border-t border-[var(--border)]">
                {[
                  { v: "4 роки",  l: "онлайн" },
                  { v: "5 000+", l: "гравців" },
                  { v: "120+",   l: "зараз" },
                ].map(({ v, l }, i) => (
                  <div key={i} className={`flex flex-col items-center py-3 gap-0.5 ${ i < 2 ? "border-r border-[var(--border)]" : "" }`}>
                    <span className="text-base font-black text-[var(--foreground)]">{v}</span>
                    <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating decorative badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-5 -left-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-[var(--border-lt)] shadow-xl"
              style={{ background: "rgba(13,20,40,0.95)", backdropFilter: "blur(12px)" }}
            >
              <span className="text-lg">🎮</span>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)] leading-none mb-0.5">Vanilla+</p>
                <p className="text-[10px] text-[var(--muted)]">Minecraft 1.21</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-4 -right-2 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-lt)] shadow-xl"
              style={{ background: "rgba(13,20,40,0.95)", backdropFilter: "blur(12px)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3d6bff] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3d6bff]" />
              </span>
              <span className="text-xs font-bold text-[var(--foreground)]">120 online</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[var(--border-lt)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
