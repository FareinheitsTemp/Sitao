"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  IconMusic, IconSword, IconArrowsVertical, IconChefHat,
  IconX, IconExternalLink,
} from "@tabler/icons-react";
import { scaleIn } from "@/constants/motion";

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
  onClose: () => void;
}

export default function DonateModal({ item, onClose }: Props) {
  const monobank = process.env.NEXT_PUBLIC_MONOBANK_URL ?? "#";
  const Icon = ICON_MAP[item.icon] ?? IconSword;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
          aria-label="Закрити"
        >
          <IconX size={18} />
        </button>

        {/* Icon */}
        <div className="inline-flex p-3.5 rounded-2xl bg-[#4ade80]/12 mb-5">
          <Icon size={28} className="text-[#4ade80]" />
        </div>

        <h3 className="text-xl font-black mb-2 tracking-tight">{item.title}</h3>
        <p className="text-[var(--muted)] text-sm leading-relaxed mb-3">{item.description}</p>

        {item.details && (
          <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted)]">
            {item.details}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <span className="text-[var(--muted)] text-sm">Вартість</span>
          <span className="text-2xl font-black text-[#4ade80]">{item.price} ₴</span>
        </div>

        <a
          href={monobank}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#4ade80] text-black font-bold hover:bg-[#22c55e] active:scale-[0.98] transition-all duration-150 text-sm"
        >
          Задонатити через Monobank
          <IconExternalLink size={16} />
        </a>

        <p className="mt-3 text-center text-xs text-[var(--muted)]">
          Після оплати напиши адміністратору в Discord із підтвердженням.
        </p>
      </motion.div>
    </motion.div>
  );
}
