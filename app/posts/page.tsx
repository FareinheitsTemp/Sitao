"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import {
  IconNotes, IconCalendar, IconTag, IconArrowRight,
  IconSearch, IconPin, IconFlame, IconConfetti,
  IconBolt, IconShoppingCart, IconX,
} from "@tabler/icons-react";

const CATEGORIES = ["Всі", "Оновлення", "Анонси", "Події", "Технічне"] as const;
type Category = typeof CATEGORIES[number];

const TAG_ICON: Record<string, React.ReactNode> = {
  "Гаряче":  <IconFlame size={11} />,
  "Подія":   <IconConfetti size={11} />,
  "Скоро":   <IconBolt size={11} />,
  "Магазин": <IconShoppingCart size={11} />,
};

const POSTS = [
  {
    id: "1",
    title: "Велике оновлення економіки сервера",
    category: "Оновлення",
    date: "03 червня 2025",
    preview: "Ми повністю переробили економічну систему SITAO. Нові магазини, баланс між фракціями та покращений аукціон чекають на вас.",
    pinned: true,
    tag: "Гаряче",
    readTime: "3 хв",
  },
  {
    id: "2",
    title: "Літня подія: Полювання на скарби",
    category: "Події",
    date: "01 червня 2025",
    preview: "З 1 по 30 червня на сервері проходить сезонна подія. Знайди 7 прихованих скарбів і отримай ексклюзивні косметичні нагороди.",
    pinned: false,
    tag: "Подія",
    readTime: "2 хв",
  },
  {
    id: "3",
    title: "Технічне обслуговування 5 червня",
    category: "Технічне",
    date: "29 травня 2025",
    preview: "5 червня з 02:00 до 05:00 сервер буде недоступний у зв'язку з плановими технічними роботами.",
    pinned: false,
    tag: null,
    readTime: "1 хв",
  },
  {
    id: "4",
    title: "Анонс нового PvP-режиму",
    category: "Анонси",
    date: "25 травня 2025",
    preview: "Незабаром на SITAO з'явиться новий режим командного PvP з рейтингом та сезонними нагородами. Деталі скоро!",
    pinned: false,
    tag: "Скоро",
    readTime: "2 хв",
  },
  {
    id: "5",
    title: "Оновлення правил — червень 2025",
    category: "Анонси",
    date: "20 травня 2025",
    preview: "Ми оновили розділ 3 правил щодо PvP-зон та додали нові пункти про взаємодію з персоналом.",
    pinned: false,
    tag: null,
    readTime: "2 хв",
  },
  {
    id: "6",
    title: "Нові донат-позиції у магазині",
    category: "Оновлення",
    date: "15 травня 2025",
    preview: "В магазині з'явились нові скіни мечів та ексклюзивні капелюхи. Тільки косметика — ніяких переваг у грі.",
    pinned: false,
    tag: "Магазин",
    readTime: "2 хв",
  },
];

const CATEGORY_META: Record<string, { color: string; bg: string }> = {
  "Оновлення": { color: "#3d6bff", bg: "rgba(61,107,255,0.12)" },
  "Анонси":    { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  "Події":     { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  "Технічне":  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
};

const TAG_META: Record<string, { color: string; bg: string }> = {
  "Гаряче":  { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  "Подія":   { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  "Скоро":   { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  "Магазин": { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
};

type Post = typeof POSTS[number];

// ─── Featured (pinned) card ───
function FeaturedCard({ post }: { post: Post }) {
  const cat = CATEGORY_META[post.category] ?? { color: "#3d6bff", bg: "rgba(61,107,255,0.12)" };
  return (
    <motion.article
      variants={fadeInUp}
      className="group relative col-span-full rounded-3xl bg-[var(--surface)] border border-[#3d6bff]/25 overflow-hidden cursor-pointer hover:border-[#3d6bff]/50 transition-all duration-300"
    >
      {/* top accent */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, #3d6bff, #22d3ee, transparent)` }} />

      {/* glow */}
      <div className="absolute top-0 left-0 w-80 h-40 rounded-full blur-3xl opacity-[0.08] pointer-events-none" style={{ background: cat.color, transform: "translate(-30%, -30%)" }} />

      <div className="relative z-10 p-7 sm:p-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
        <div>
          {/* badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: cat.color, background: cat.bg }}>
              <IconTag size={11} />
              {post.category}
            </span>
            {post.tag && TAG_META[post.tag] && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ color: TAG_META[post.tag].color, background: TAG_META[post.tag].bg }}>
                {TAG_ICON[post.tag]}
                {post.tag}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#fbbf24] bg-[rgba(251,191,36,0.1)]">
              <IconPin size={11} />
              Закріплено
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-3 leading-snug">
            {post.title}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xl">
            {post.preview}
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-4">
          <div className="flex flex-col gap-1.5 lg:text-right">
            <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] lg:justify-end">
              <IconCalendar size={12} />
              {post.date}
            </span>
            <span className="text-xs text-[var(--muted)]">{post.readTime} читання</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-150 active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #3d6bff 0%, #1a3a99 100%)", boxShadow: "0 0 16px rgba(61,107,255,0.3)" }}>
            Читати
            <IconArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Regular card ───
function PostCard({ post, index }: { post: Post; index: number }) {
  const cat = CATEGORY_META[post.category] ?? { color: "#3d6bff", bg: "rgba(61,107,255,0.12)" };
  return (
    <motion.article
      variants={fadeInUp}
      className="group relative flex flex-col rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/30 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-3xl" style={{ background: `linear-gradient(to bottom, ${cat.color}, transparent)` }} />

      {/* index watermark */}
      <span
        className="absolute -bottom-3 -right-1 text-[5rem] font-black leading-none select-none pointer-events-none"
        style={{ color: `${cat.color}07` }}
      >
        {String(index).padStart(2, "0")}
      </span>

      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 0% 0%, ${cat.color}0e, transparent 70%)` }} />

      <div className="relative z-10 flex flex-col flex-1 p-5 sm:p-6 pl-7">
        {/* badges */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ color: cat.color, background: cat.bg }}>
            <IconTag size={10} />
            {post.category}
          </span>
          {post.tag && TAG_META[post.tag] && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ color: TAG_META[post.tag].color, background: TAG_META[post.tag].bg }}>
              {TAG_ICON[post.tag]}
              {post.tag}
            </span>
          )}
        </div>

        <h2 className="font-black text-base mb-2 leading-snug group-hover:text-[#3d6bff] transition-colors duration-200">
          {post.title}
        </h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-2 flex-1">
          {post.preview}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <IconCalendar size={12} />
            {post.date}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#3d6bff] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
            Читати <IconArrowRight size={13} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function PostsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Всі");
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === "Всі" || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.pinned);
  const regular  = filtered.filter((p) => !p.pinned);

  return (
    <div className="min-h-screen pt-16">

      {/* ── Hero ── */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #3d6bff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#3d6bff] opacity-[0.05] blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3d6bff]/30 bg-[rgba(61,107,255,0.08)] text-[#5b84ff] text-xs font-semibold tracking-wide uppercase">
                  <IconNotes size={13} />
                  Стрічка новин
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Новини<br />
                <span style={{ background: "linear-gradient(135deg, #3d6bff 0%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>SITAO</span>
              </motion.h1>
            </div>
            <motion.p variants={fadeInUp} className="text-[var(--muted)] max-w-xs leading-relaxed text-sm lg:text-right">
              Оновлення, анонси, події та офіційні повідомлення від команди сервера.
            </motion.p>
          </div>

          {/* divider with count */}
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-10">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-mono text-[var(--muted)] px-2">{POSTS.length} публікацій</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Filters ── */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <IconSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Пошук новин..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#3d6bff]/40 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  <IconX size={14} />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const meta = cat !== "Всі" ? CATEGORY_META[cat] : null;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
                    style={isActive && meta
                      ? { color: meta.color, background: meta.bg, borderColor: meta.color, borderWidth: "1px", borderStyle: "solid" }
                      : isActive
                      ? { background: "rgba(61,107,255,0.15)", color: "#5b84ff", borderColor: "rgba(61,107,255,0.4)", borderWidth: "1px", borderStyle: "solid" }
                      : { background: "var(--surface)", color: "var(--muted-foreground)", borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid" }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeCategory + search}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {/* Featured cards span full width */}
                {featured.map((post) => (
                  <FeaturedCard key={post.id} post={post} />
                ))}

                {/* Regular cards */}
                {regular.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i + 1} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 flex flex-col items-center gap-4"
              >
                <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <IconNotes size={28} className="text-[var(--muted)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-1">Нічого не знайдено</p>
                  <p className="text-xs text-[var(--muted)]">Спробуй інший запит або категорію</p>
                </div>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("Всі"); }}
                  className="text-xs text-[#3d6bff] hover:underline font-semibold"
                >
                  Скинути фільтри
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
