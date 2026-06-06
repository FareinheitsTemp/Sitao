"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  fadeInUp, staggerContainer, scaleIn,
  backdropVariants, modalVariants, blurIn, staggerFast
} from "@/constants/motion";
import {
  IconBook, IconAlertTriangle, IconMessageCircle,
  IconSword, IconShield, IconUsers, IconX,
  IconChevronRight, IconPointFilled,
} from "@tabler/icons-react";

// ── Data ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "general",
    icon: IconShield,
    title: "Загальні правила",
    color: "#5b84ff",
    glow: "rgba(91,132,255,0.4)",
    angle: -90,
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
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.4)",
    angle: -90 + 360 / 5,
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
    glow: "rgba(245,158,11,0.4)",
    angle: -90 + (360 / 5) * 2,
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
    glow: "rgba(167,139,250,0.4)",
    angle: -90 + (360 / 5) * 3,
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
    glow: "rgba(248,113,113,0.4)",
    angle: -90 + (360 / 5) * 4,
    rules: [
      { n: "5.1", text: "За перше незначне порушення видається попередження (warn)." },
      { n: "5.2", text: "Повторні або грубі порушення тягнуть за собою тимчасове або постійне відключення." },
      { n: "5.3", text: "Використання читів тягне за собою негайний постійний бан без попереджень." },
      { n: "5.4", text: "Оскарження рішень адміністрації можливе через Discord тікет-систему." },
      { n: "5.5", text: "Обхід бану (через alt-акаунти) тягне за собою розширення покарання." },
    ],
  },
];

const R = 200; // orbit radius
const CX = 300;
const CY = 300;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function nodePos(angle: number) {
  return {
    x: CX + R * Math.cos(toRad(angle)),
    y: CY + R * Math.sin(toRad(angle)),
  };
}

// ── Constellation (desktop) ─────────────────────────────────────────────────
function ConstellationDiagram({ onSelect }: { onSelect: (cat: typeof CATEGORIES[0]) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="relative flex items-center justify-center select-none pb-8">
      {/* Outer glow */}
      <div className="absolute w-[440px] h-[440px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[80px] pointer-events-none" />

      <svg
        ref={ref}
        viewBox="0 0 600 600"
        width={520}
        height={520}
        className="relative z-10 w-full max-w-[520px]"
        style={{ overflow: 'visible' }}
      >
        {/* Orbit ring */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="var(--border-lt)"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="orbit-ring"
        />
        {/* Outer orbit ring */}
        <circle
          cx={CX} cy={CY} r={R + 28}
          fill="none"
          stroke="var(--border)"
          strokeWidth="0.5"
          strokeDasharray="2 10"
          opacity={0.4}
        />

        {/* Energy links */}
        {CATEGORIES.map((cat, i) => {
          const { x, y } = nodePos(cat.angle);
          const len = Math.hypot(x - CX, y - CY);
          return (
            <motion.line
              key={cat.id}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke={hovered === cat.id ? cat.color : 'var(--border-lt)'}
              strokeWidth={hovered === cat.id ? 1.5 : 1}
              strokeDasharray={len}
              initial={{ strokeDashoffset: len }}
              animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: len }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.16,1,0.3,1] }}
              opacity={hovered === cat.id ? 0.9 : 0.3}
              style={{ transition: 'stroke 0.2s, opacity 0.2s' }}
            />
          );
        })}

        {/* Centre node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {/* Outer pulse ring */}
          <motion.circle
            cx={CX} cy={CY} r={46}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            animate={{ r: [44, 52, 44], opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx={CX} cy={CY} r={38} fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r={32} fill="var(--surface-3)" />
          <text
            x={CX} y={CY - 5}
            textAnchor="middle" dominantBaseline="middle"
            fill="var(--accent-lt)"
            fontSize="10"
            fontWeight="700"
            fontFamily="Cinzel, serif"
            letterSpacing="2"
          >
            SITAO
          </text>
          <text
            x={CX} y={CY + 9}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="7"
            fontFamily="monospace"
          >
            ПРАВИЛА
          </text>
        </motion.g>

        {/* Category nodes */}
        {CATEGORIES.map((cat, i) => {
          const { x, y } = nodePos(cat.angle);
          const Icon = cat.icon;
          const isHov = hovered === cat.id;
          return (
            <motion.g
              key={cat.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.16,1,0.3,1] }}
              style={{ transformOrigin: `${x}px ${y}px`, cursor: 'pointer' }}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(cat)}
            >
              {/* Hover glow */}
              {isHov && (
                <motion.circle
                  cx={x} cy={y} r={36}
                  fill={cat.color}
                  opacity={0.12}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.12 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Node bg */}
              <motion.circle
                cx={x} cy={y} r={28}
                fill="var(--surface-2)"
                stroke={isHov ? cat.color : 'var(--border-lt)'}
                strokeWidth={isHov ? 1.5 : 1}
                animate={{ r: isHov ? 30 : 28 }}
                transition={{ duration: 0.2 }}
                style={{ filter: isHov ? `drop-shadow(0 0 8px ${cat.color})` : undefined }}
              />
              <circle cx={x} cy={y} r={22} fill="var(--surface-3)" />

              {/* foreignObject for React icon */}
              <foreignObject x={x - 10} y={y - 18} width={20} height={20}>
                <Icon
                  size={18}
                  style={{ color: isHov ? cat.color : 'var(--muted-lt)', display: 'block', transition: 'color 0.2s' }}
                />
              </foreignObject>

              {/* Label below node */}
              <text
                x={x}
                y={y + 40}
                textAnchor="middle"
                fill={isHov ? cat.color : 'var(--muted-lt)'}
                fontSize="9.5"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
                style={{ transition: 'fill 0.2s', pointerEvents: 'none' }}
              >
                {cat.title.length > 16 ? cat.title.slice(0, 15) + '…' : cat.title}
              </text>

              {/* Rule count */}
              <text
                x={x}
                y={y + 52}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="7.5"
                fontFamily="monospace"
                style={{ pointerEvents: 'none' }}
              >
                {cat.rules.length} правил
              </text>

              {/* Dot centre */}
              <circle cx={x} cy={y} r={3} fill={isHov ? cat.color : 'var(--border-lt)'} style={{ transition: 'fill 0.2s' }} />
            </motion.g>
          );
        })}
      </svg>

      {/* Tap hint */}
      <motion.p
        className="absolute -bottom-6 text-xs text-[var(--muted)] tracking-wide"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      >
        Натисни на вузол щоб відкрити правила
      </motion.p>
    </div>
  );
}

// ── Mobile cards ─────────────────────────────────────────────────────────────
function MobileRuleCard({
  cat,
  index,
  onSelect,
}: {
  cat: typeof CATEGORIES[0];
  index: number;
  onSelect: (cat: typeof CATEGORIES[0]) => void;
}) {
  const Icon = cat.icon;
  return (
    <motion.button
      variants={fadeInUp}
      onClick={() => onSelect(cat)}
      className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left group transition-colors"
      style={{
        background: `${cat.color}08`,
        borderColor: `${cat.color}25`,
      }}
      whileHover={{ scale: 1.01, borderColor: cat.color + '60' } as never}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${cat.color}18` }}
      >
        <Icon size={20} style={{ color: cat.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[var(--foreground)] text-sm">{cat.title}</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">{cat.rules.length} правил</p>
      </div>
      <IconChevronRight size={16} className="text-[var(--muted)] shrink-0" />
    </motion.button>
  );
}

// ── Rule Modal ───────────────────────────────────────────────────────────────
function RuleModal({
  cat,
  onClose,
}: {
  cat: typeof CATEGORIES[0];
  onClose: () => void;
}) {
  const Icon = cat.icon;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden" animate="visible" exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(3,7,16,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={modalVariants}
          initial="hidden" animate="visible" exit="exit"
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${cat.color}35`,
            boxShadow: `0 0 60px ${cat.glow}, 0 24px 64px rgba(0,0,0,0.7)`,
          }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }} />

          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: cat.color + '20' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${cat.color}18` }}
            >
              <Icon size={20} style={{ color: cat.color }} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-[var(--foreground)]">{cat.title}</h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">{cat.rules.length} правил</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Rules list */}
          <motion.div
            className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto"
            variants={staggerFast}
            initial="hidden" animate="visible"
          >
            {cat.rules.map((rule, i) => (
              <motion.div
                key={rule.n}
                variants={fadeInUp}
                className="flex gap-3 group"
              >
                {/* Number badge */}
                <div
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black font-mono mt-0.5"
                  style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}30` }}
                >
                  {rule.n}
                </div>

                {/* Rule text with left line */}
                <div
                  className="flex-1 border-l pl-3 py-0.5"
                  style={{ borderColor: `${cat.color}25` }}
                >
                  <p className="text-sm text-[var(--foreground-dim)] leading-relaxed">{rule.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer progress dots */}
          <div className="px-6 pb-5 flex items-center gap-1.5">
            {cat.rules.map((_, i) => (
              <motion.div
                key={i}
                className="h-0.5 rounded-full"
                style={{ background: cat.color }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 24, opacity: 0.5 }}
                transition={{ delay: 0.05 * i + 0.3, duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function RulesPage() {
  const [selected, setSelected] = useState<typeof CATEGORIES[0] | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen pt-16">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden flex flex-col items-center">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(61,107,255,0.08) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)' }}
          />
        </div>

        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-dim)] bg-[var(--accent)]/8 text-[var(--accent-lt)] text-xs font-semibold mb-6 tracking-wider uppercase">
            <IconBook size={13} />
            Оновлено 2026
          </motion.div>

          {/* Title */}
          <motion.h1 variants={blurIn} className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-tight">
            Правила{" "}
            <span className="gradient-text">SITAO</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-[var(--muted-lt)] leading-relaxed max-w-md mx-auto text-sm sm:text-base">
            Дотримання правил забезпечує комфортну гру для всіх. Порушення тягнуть за собою санкції відповідно до їхньої тяжкості.
          </motion.p>

          {/* Stats row */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-10 mt-8">
            {[
              { label: 'Категорій', value: CATEGORIES.length },
              { label: 'Правил', value: CATEGORIES.reduce((s, c) => s + c.rules.length, 0) },
              { label: 'Онлайн', value: '24/7' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-[var(--accent-lt)]">{value}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Desktop constellation ── */}
      <section className="hidden md:flex justify-center pb-8 px-6">
        <ConstellationDiagram onSelect={setSelected} />
      </section>

      {/* ── Mobile cards ── */}
      <section className="md:hidden pb-8 px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {CATEGORIES.map((cat, i) => (
            <MobileRuleCard key={cat.id} cat={cat} index={i} onSelect={setSelected} />
          ))}
        </motion.div>
      </section>

      {/* ── All rules quick-view (desktop below diagram) ── */}
      <section className="hidden md:block pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs text-[var(--muted)] text-center mb-6 uppercase tracking-widest"
          >
            Або перегляньте всі категорії
          </motion.p>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 lg:grid-cols-5 gap-3"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  variants={scaleIn}
                  onClick={() => setSelected(cat)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all group"
                  style={{ background: `${cat.color}08`, borderColor: `${cat.color}20` }}
                  whileHover={{ scale: 1.04, borderColor: cat.color + '60', boxShadow: `0 0 20px ${cat.glow}` } as never}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon size={22} style={{ color: cat.color }} />
                  <span className="text-xs font-semibold text-[var(--foreground-dim)] text-center leading-tight">{cat.title}</span>
                  <span className="text-[10px] text-[var(--muted)] font-mono">{cat.rules.length}п</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Mobile all rules expanded ── */}
      <section className="md:hidden pb-16 px-4">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <details key={cat.id} className="group rounded-2xl border overflow-hidden" style={{ borderColor: `${cat.color}25` }}>
              <summary
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer list-none"
                style={{ background: `${cat.color}06` }}
              >
                <IconPointFilled size={10} style={{ color: cat.color, flexShrink: 0 }} />
                <span className="text-sm font-semibold text-[var(--foreground-dim)] flex-1">{cat.title}</span>
                <span className="text-xs font-mono text-[var(--muted)]">{cat.rules.length}п</span>
              </summary>
              <div className="px-4 pb-4 pt-2 space-y-3 animate-slide-down" style={{ borderTop: `1px solid ${cat.color}15` }}>
                {cat.rules.map((rule) => (
                  <div key={rule.n} className="flex gap-2.5">
                    <span className="shrink-0 text-[10px] font-black font-mono mt-0.5" style={{ color: cat.color }}>{rule.n}</span>
                    <p className="text-xs text-[var(--muted-lt)] leading-relaxed">{rule.text}</p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Warning note ── */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-5 rounded-2xl flex gap-3"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <IconAlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
            <p className="text-sm text-[var(--muted-lt)] leading-relaxed">
              Правила можуть оновлюватись. Адміністрація повідомляє про зміни в Discord. Слідкуй за оголошеннями.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Modal ── */}
      {selected && <RuleModal cat={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
