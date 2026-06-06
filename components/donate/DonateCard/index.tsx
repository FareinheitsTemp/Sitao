// DonateCard is no longer used on the main donate page (replaced by sidebar+detail layout)
// Kept for potential reuse elsewhere
"use client";

import { motion } from "framer-motion";
import { IconMusic, IconSword, IconArrowsVertical, IconChefHat } from "@tabler/icons-react";
import { fadeInUp } from "@/constants/motion";

const ICON_MAP: Record<string, React.ElementType> = {
  MusicNote:      IconMusic,
  Sword:          IconSword,
  ArrowsVertical: IconArrowsVertical,
  Hat:            IconChefHat,
};

const ITEM_COLORS: Record<string, string> = {
  track:  "#a78bfa",
  sword:  "#f87171",
  height: "#60a5fa",
  hat:    "#fbbf24",
};

interface DonateItem {
  id: string;
  title: string;
  price: number;
  description: string;
  details: string | null;
  icon: string;
}

interface Props {
  item: DonateItem;
  onClick: () => void;
}

export default function DonateCard({ item, onClick }: Props) {
  const Icon = ICON_MAP[item.icon] ?? IconSword;
  const color = ITEM_COLORS[item.id] ?? "#3d6bff";

  return (
    <motion.button
      variants={fadeInUp}
      onClick={onClick}
      className="group relative w-full text-left p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--muted)]/30 active:scale-[0.99] transition-all duration-200 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 100% 0%, ${color}0a, transparent 60%)` }}
      />
      <div className="relative z-10 flex items-start gap-4">
        <div className="shrink-0 p-3 rounded-2xl transition-colors" style={{ background: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-1 tracking-tight">{item.title}</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{item.description}</p>
          {item.details && <p className="text-xs text-[var(--muted)]/70 mb-3">{item.details}</p>}
          <span className="text-sm font-bold" style={{ color }}>{item.price} ₴</span>
        </div>
      </div>
    </motion.button>
  );
}
