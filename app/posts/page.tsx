"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/constants/motion";
import {
  IconNotes, IconCalendar, IconTag, IconArrowRight, IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

const CATEGORIES = ["Всі", "Оновлення", "Анонси", "Події", "Технічне"] as const;
type Category = typeof CATEGORIES[number];

const POSTS = [
  {
    id: "1",
    title: "Велике оновлення економіки сервера",
    category: "Оновлення",
    date: "03 червня 2025",
    preview: "Ми повністю переробили економічну систему SITAO. Нові магазини, баланс між фракціями та покращений аукціон чекають на вас.",
    pinned: true,
    tag: "🔥 Гаряче",
  },
  {
    id: "2",
    title: "Літня подія: Полювання на скарби",
    category: "Події",
    date: "01 червня 2025",
    preview: "З 1 по 30 червня на сервері проходить сезонна подія. Знайди 7 прихованих скарбів і отримай ексклюзивні косметичні нагороди.",
    pinned: false,
    tag: "🎉 Подія",
  },
  {
    id: "3",
    title: "Технічне обслуговування 5 червня",
    category: "Технічне",
    date: "29 травня 2025",
    preview: "5 червня з 02:00 до 05:00 сервер буде недоступний у зв'язку з плановими технічними роботами.",
    pinned: false,
    tag: null,
  },
  {
    id: "4",
    title: "Анонс нового PvP-режиму",
    category: "Анонси",
    date: "25 травня 2025",
    preview: "Незабаром на SITAO з'явиться новий режим командного PvP з рейтингом та сезонними нагородами. Деталі скоро!",
    pinned: false,
    tag: "⚡ Скоро",
  },
  {
    id: "5",
    title: "Оновлення правил — червень 2025",
    category: "Анонси",
    date: "20 травня 2025",
    preview: "Ми оновили розділ 3 правил щодо PvP-зон та додали нові пункти про взаємодію з персоналом.",
    pinned: false,
    tag: null,
  },
  {
    id: "6",
    title: "Нові донат-позиції у магазині",
    category: "Оновлення",
    date: "15 травня 2025",
    preview: "В магазині з'явились нові скіни мечів та ексклюзивні капелюхи. Тільки косметика — ніяких переваг у грі.",
    pinned: false,
    tag: "🛒 Магазин",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Оновлення": "#4ade80",
  "Анонси":    "#60a5fa",
  "Події":     "#f59e0b",
  "Технічне":  "#a78bfa",
};

function PostCard({ post }: { post: typeof POSTS[number] }) {
  const color = CATEGORY_COLORS[post.category] ?? "#4ade80";

  return (
    <motion.article
      variants={fadeInUp}
      className="group relative rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--surface-2)] hover:bg-[var(--surface-2)] transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="p-5 sm:p-6">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold"
            style={{ color, background: `${color}18` }}
          >
            <IconTag size={11} />
            {post.category}
          </span>

          {post.tag && (
            <span className="text-xs text-[var(--muted)]">{post.tag}</span>
          )}

          {post.pinned && (
            <span className="ml-auto text-xs font-medium text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-lg">
              📌 Закріплено
            </span>
          )}
        </div>

        <h2 className="font-black text-base mb-2 leading-snug group-hover:text-[#4ade80] transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-2">
          {post.preview}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <IconCalendar size={13} />
            {post.date}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity">
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
            <IconNotes size={16} />
            Стрічка новин
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Новини{" "}
            <span className="text-[#4ade80]">SITAO</span>
          </h1>
          <p className="text-[var(--muted)] leading-relaxed max-w-md mx-auto text-sm sm:text-base">
            Оновлення, анонси, події та офіційні повідомлення від команди сервера.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="relative mb-5">
            <IconSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Пошук новин..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#4ade80]/40 transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-[#4ade80] text-black"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + search}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-[var(--muted)]"
            >
              <IconNotes size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Нічого не знайдено</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
