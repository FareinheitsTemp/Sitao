"use client";

import { motion } from "framer-motion";
import {
  IconMusic, IconSword, IconArrowsVertical, IconChefHat,
} from "@tabler/icons-react";
import { fadeInUp } from "@/constants/motion";

const ICON_MAP: Record<string, React.ElementType> = {
  MusicNote:      IconMusic,
  Sword:          IconSword,
  ArrowsVertical: IconArrowsVertical,
  Hat:            IconChefHat,
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

  return (
    <motion.button
      variants={fadeInUp}
      onClick={onClick}
      className="group relative w-full text-left p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#4ade80]/40 hover:bg-[var(--surface-2)] active:scale-[0.99] transition-all duration-200 overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, #4ade8008, transparent 60%)" }}
      />

      <div className="relative z-10 flex items-start gap-4">
        <div className="shrink-0 p-3 rounded-2xl bg-[#4ade80]/10 group-hover:bg-[#4ade80]/18 transition-colors">
          <Icon size={24} className="text-[#4ade80]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-1 tracking-tight">{item.title}</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">{item.description}</p>
          {item.details && (
            <p className="text-xs text-[var(--muted)]/70 mb-3">{item.details}</p>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#4ade80]">
            {item.price} ₴
          </span>
        </div>
      </div>
    </motion.button>
  );
}
