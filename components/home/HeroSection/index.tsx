"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconBrandDiscord, IconCopy, IconCheck, IconMap } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

const SERVER_IP = "sitao.fun";

const STATS = [
  { value: "120+",  label: "онлайн зараз" },
  { value: "5 000+",label: "гравців" },
  { value: "4 роки", label: "безперервно" },
];

const TIMELINE = [
  { year: "2022", label: "Запуск сервера",     detail: "Перший запуск SITAO.fun — 12 гравців online",                y: 78 },
  { year: "2023", label: "Спільнота зростає",  detail: "Discord досяг 500 учасників, перший великий івент",       y: 52 },
  { year: "2024", label: "Великий апдейт",      detail: "Нові плагіни, клейм-система та рейтинги гравців",         y: 30 },
  { year: "2025", label: "5 000 гравців",       detail: "Milestone: 5к унікальних гравців за весь час",           y: 14 },
  { year: "2026", label: "Зараз · 120+ online",  detail: "Сервер живе, розвивається і чекає на тебе",          y: 8  },
];

const W = 480, H = 200, PX = 36, PY = 16;
const cW = W - PX * 2, cH = H - PY * 2;
function xOf(i: number) { return PX + (i / (TIMELINE.length - 1)) * cW; }
function yOf(p: number) { return PY + (p / 100) * cH; }
const pts = TIMELINE.map((t, i) => ({ x: xOf(i), y: yOf(t.y) }));

function buildPath(ratio: number) {
  if (ratio <= 0 || pts.length < 2) return "";
  const total = TIMELINE.length - 1;
  const drawn = ratio * total;
  const full = Math.floor(drawn);
  const frac = drawn - full;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < full && i < pts.length - 1; i++) {
    const cx1 = pts[i].x + (pts[i+1].x - pts[i].x) * 0.5;
    const cx2 = pts[i+1].x - (pts[i+1].x - pts[i].x) * 0.5;
    d += ` C ${cx1} ${pts[i].y} ${cx2} ${pts[i+1].y} ${pts[i+1].x} ${pts[i+1].y}`;
  }
  if (full < pts.length - 1 && frac > 0) {
    const i = full;
    const cx1 = pts[i].x + (pts[i+1].x - pts[i].x) * 0.5;
    const cx2 = pts[i+1].x - (pts[i+1].x - pts[i].x) * 0.5;
    const t2 = frac;
    const bx = (1-t2)**3*pts[i].x + 3*(1-t2)**2*t2*cx1 + 3*(1-t2)*t2**2*cx2 + t2**3*pts[i+1].x;
    const by = (1-t2)**3*pts[i].y + 3*(1-t2)**2*t2*pts[i].y + 3*(1-t2)*t2**2*pts[i+1].y + t2**3*pts[i+1].y;
    d += ` C ${cx1} ${pts[i].y} ${cx2} ${pts[i+1].y} ${bx} ${by}`;
  }
  return d;
}

function buildArea(ratio: number) {
  const line = buildPath(ratio);
  if (!line) return "";
  const total = TIMELINE.length - 1;
  const drawn = ratio * total;
  const full = Math.floor(Math.min(drawn, total));
  const frac = drawn - full;
  let ex: number, ey: number;
  if (full >= total) { ex = pts[pts.length-1].x; ey = pts[pts.length-1].y; }
  else {
    const i = full;
    const cx1 = pts[i].x + (pts[i+1].x - pts[i].x) * 0.5;
    const cx2 = pts[i+1].x - (pts[i+1].x - pts[i].x) * 0.5;
    ex = (1-frac)**3*pts[i].x + 3*(1-frac)**2*frac*cx1 + 3*(1-frac)*frac**2*cx2 + frac**3*pts[i+1].x;
    ey = (1-frac)**3*pts[i].y + 3*(1-frac)**2*frac*pts[i].y + 3*(1-frac)*frac**2*pts[i+1].y + frac**3*pts[i+1].y;
  }
  return `${line} L ${ex} ${H - PY} L ${pts[0].x} ${H - PY} Z`;
}

const reveal = {
  hidden: { opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" },
  visible: (i = 0) => ({
    opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const discord = process.env.NEXT_PUBLIC_DISCORD_URL ?? "#";
  const dynmap  = process.env.NEXT_PUBLIC_DYNMAP_URL  ?? "#";

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    let start: number | null = null;
    const duration = 1800;
    const ease = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(ease(p));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => { frame = requestAnimationFrame(animate); }, 400);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [inView]);

  function copyIp() {
    navigator.clipboard?.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* single subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#3d6bff] opacity-[0.04] blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center min-h-[calc(100vh-4rem)] py-20">

          {/* LEFT */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div
              custom={0} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mb-8 flex items-center gap-3"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3d6bff] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3d6bff]" />
              </span>
              <span className="text-xs font-mono text-[var(--muted-lt)] tracking-widest uppercase">sitao.fun · онлайн</span>
            </motion.div>

            {/* Heading */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                custom={1} variants={reveal} initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-[clamp(3rem,7vw,5.5rem)] font-black tracking-tight leading-[1.0] text-[var(--foreground)]"
              >
                Твій<br />
                <span className="gradient-text">Minecraft</span><br />
                дім
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              custom={2} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-base text-[var(--muted-lt)] max-w-sm mb-10 leading-relaxed"
            >
              Сервер з живою спільнотою, власними механіками та атмосферою,
              яка запам&apos;ятовується.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              custom={3} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-3 mb-10"
            >
              <a
                href={discord} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3d6bff] hover:bg-[#2d5bef] active:scale-[0.97] transition-all duration-150"
              >
                <IconBrandDiscord size={16} />
                Приєднатись
              </a>
              <a
                href={dynmap} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--muted-lt)] border border-[var(--border)] hover:border-[var(--border-lt)] hover:text-[var(--foreground)] active:scale-[0.97] transition-all duration-150"
              >
                <IconMap size={16} />
                Карта
              </a>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] active:scale-[0.97] transition-all duration-150"
              >
                Донат
              </Link>
            </motion.div>

            {/* IP + stats */}
            <motion.div
              custom={4} variants={reveal} initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="space-y-4"
            >
              <button
                onClick={copyIp}
                className="group flex items-center gap-3 w-fit"
              >
                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest">IP</span>
                <div className="w-px h-3 bg-[var(--border)]" />
                <span className="font-mono text-sm text-[var(--foreground-dim)] group-hover:text-[var(--foreground)] transition-colors">{SERVER_IP}</span>
                <span className={`transition-colors duration-200 ${copied ? "text-[#3d6bff]" : "text-[var(--muted)] group-hover:text-[var(--muted-lt)]"}`}>
                  {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                </span>
                {copied && <span className="text-xs text-[#3d6bff] font-mono">Скопійовано</span>}
              </button>

              {/* Stats row */}
              <div className="flex items-center gap-6">
                {STATS.map(({ value, label }, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-sm font-black text-[var(--foreground)]">{value}</span>
                    <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <div
              className="w-full max-w-lg rounded-2xl border border-[var(--border)] overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              {/* Chart header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-0.5">Активність</p>
                  <p className="text-sm font-bold text-[var(--foreground)]">SITAO · 2022–2026</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--border-lt)]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--border-lt)]" />
                  <span className="w-2 h-2 rounded-full bg-[#3d6bff]/60" />
                </div>
              </div>

              {/* SVG */}
              <div className="px-4 pt-5 pb-3">
                <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
                  <defs>
                    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1a3a99" />
                      <stop offset="100%" stopColor="#3d6bff" />
                    </linearGradient>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d6bff" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3d6bff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((f, i) => (
                    <line key={i} x1={PX} y1={PY + f*cH} x2={W-PX} y2={PY + f*cH} stroke="rgba(61,107,255,0.06)" strokeWidth="1" />
                  ))}
                  {progress > 0 && <path d={buildArea(progress)} fill="url(#ag)" />}
                  {progress > 0 && <path d={buildPath(progress)} fill="none" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" />}
                  {TIMELINE.map((t, i) => {
                    const vis = progress >= (i / (TIMELINE.length - 1)) - 0.02;
                    return vis ? (
                      <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)}>
                        <circle cx={pts[i].x} cy={pts[i].y} r={14} fill="transparent" />
                        <circle cx={pts[i].x} cy={pts[i].y} r={activeIdx === i ? 4 : 3}
                          fill={activeIdx === i ? "#5b84ff" : "#3d6bff"}
                          stroke={activeIdx === i ? "rgba(91,132,255,0.35)" : "rgba(61,107,255,0.2)"}
                          strokeWidth={activeIdx === i ? 6 : 4}
                          style={{ transition: "all 0.15s" }}
                        />
                        <text x={pts[i].x} y={H-2} textAnchor="middle" fontSize="10"
                          fill={activeIdx === i ? "#5b84ff" : "rgba(61,107,255,0.5)"}
                          fontFamily="var(--font-geist-mono, monospace)" fontWeight="500"
                          style={{ transition: "fill 0.15s" }}
                        >{t.year}</text>
                      </g>
                    ) : null;
                  })}
                </svg>
              </div>

              {/* Tooltip */}
              <div className="px-5 pb-4 min-h-[52px]">
                <AnimatePresence mode="wait">
                  {activeIdx !== null ? (
                    <motion.div key={activeIdx}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-[#3d6bff] tracking-widest">{TIMELINE[activeIdx].year}</span>
                        <span className="text-sm font-bold">{TIMELINE[activeIdx].label}</span>
                      </div>
                      <p className="text-xs text-[var(--muted-lt)]">{TIMELINE[activeIdx].detail}</p>
                    </motion.div>
                  ) : (
                    <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[11px] text-[var(--muted)] font-mono"
                    >
                      наведи на точку
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 border-t border-[var(--border)]">
                {[
                  { v: "4 роки",  l: "онлайн" },
                  { v: "5 000+", l: "гравців" },
                  { v: "120+",   l: "зараз" },
                ].map(({ v, l }, i) => (
                  <div key={i} className={`flex flex-col items-center py-3.5 gap-0.5 ${i < 2 ? "border-r border-[var(--border)]" : ""}`}>
                    <span className="text-sm font-black">{v}</span>
                    <span className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-widest">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[var(--border-lt)] to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
