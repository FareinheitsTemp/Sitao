"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown, IconHelpCircle } from "@tabler/icons-react";

const FAQ_ITEMS = [
  {
    id: "safety",
    question: "Чи безпечно переказувати кошти?",
    answer:
      "Так. Оплата здійснюється через офіційний сервіс Monobank — твої дані та кошти повністю захищені. Ми не зберігаємо жодних платіжних даних.",
  },
  {
    id: "timing",
    question: "Коли нарахують бонуси після оплати?",
    answer:
      "Зазвичай протягом 24 годин після того, як ти надішлеш скріншот підтвердження оплати адміністратору в Discord. У пікові дні може бути до 48 годин.",
  },
  {
    id: "confirm",
    question: "Як підтвердити оплату?",
    answer:
      "Після переказу зроби скріншот чека в застосунку Monobank та надішли його адміністратору в нашому Discord-сервері. Вкажи також свій нікнейм у грі.",
  },
  {
    id: "refund",
    question: "Чи можна повернути кошти?",
    answer:
      "Оскільки бонуси є цифровими та видаються одразу після підтвердження, повернення коштів не передбачено. У разі технічної помилки з нашого боку — звертайся до адміністрації.",
  },
  {
    id: "p2w",
    question: "Чи дає донат ігрові переваги?",
    answer:
      "Ні. Усі позиції — виключно косметичні: кастомна музика, скіни мечів, висота персонажа, капелюхи. Жодних бустів, швидкості чи спорядження — принцип честі та fairplay.",
  },
  {
    id: "multiple",
    question: "Можна придбати кілька позицій одразу?",
    answer:
      "Так! Просто вкажи в повідомленні адміністратору, які саме позиції тебе цікавлять, і переведи загальну суму одним платежем або окремими транзакціями.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[#4ade80] transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 text-[var(--muted)] group-hover:text-[#4ade80] transition-colors"
        >
          <IconChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-[var(--muted)] leading-relaxed pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DonateFAQ() {
  const [openId, setOpenId] = useState<string | null>("safety");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 rounded-xl bg-[#4ade80]/10">
          <IconHelpCircle size={20} className="text-[#4ade80]" />
        </div>
        <h2 className="text-lg font-black tracking-tight">Поширені запитання</h2>
      </div>

      {/* Items */}
      <div>
        {FAQ_ITEMS.map((item) => (
          <FAQItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={openId === item.id}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
