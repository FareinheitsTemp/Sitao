"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconEye, IconEyeOff, IconUser, IconLock, IconMail, IconCheck } from "@tabler/icons-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ символів", ok: password.length >= 8 },
    { label: "Велика літера", ok: /[A-Z]/.test(password) },
    { label: "Цифра", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["", "#f87171", "#f59e0b", "#4ade80"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score] : "var(--border)" }}
          />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {checks.map((c) => (
          <span key={c.label} className={`flex items-center gap-1 text-[10px] transition-colors ${c.ok ? "text-[#4ade80]" : "text-[var(--muted)]"}`}>
            <IconCheck size={10} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nickname: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.nickname || !form.email || !form.password || !form.confirm) {
      setError("Заповни всі поля");
      return;
    }
    if (form.nickname.length < 3) {
      setError("Нікнейм має бути мінімум 3 символи");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Введи коректний email");
      return;
    }
    if (form.password.length < 8) {
      setError("Пароль має бути мінімум 8 символів");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Паролі не співпадають");
      return;
    }

    setLoading(true);
    // TODO: підключи реальний API тут
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setError("Реєстрація поки недоступна"); // placeholder
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-24 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#4ade80] opacity-[0.04] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-7 sm:p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="font-black text-2xl tracking-tight mb-1">
              <span className="text-[#4ade80]">SITAO</span>
              <span className="text-[var(--muted)]">.fun</span>
            </div>
            <p className="text-sm text-[var(--muted)]">Створи акаунт гравця</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nickname */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Нікнейм (Minecraft)
              </label>
              <div className="relative">
                <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="Steve"
                  value={form.nickname}
                  onChange={set("nickname")}
                  maxLength={16}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="steve@mail.com"
                  value={form.email}
                  onChange={set("email")}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Пароль
              </label>
              <div className="relative">
                <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  className="w-full pl-9 pr-10 py-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {show ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Підтвердити пароль
              </label>
              <div className="relative">
                <IconLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set("confirm")}
                  className={`w-full pl-9 pr-4 py-3 rounded-2xl bg-[var(--surface-2)] border text-sm placeholder:text-[var(--muted)] focus:outline-none transition-colors ${
                    form.confirm && form.confirm !== form.password
                      ? "border-[#f87171]/50"
                      : "border-[var(--border)] focus:border-[#4ade80]/50"
                  }`}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-[#f87171] bg-[#f87171]/10 px-3 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#4ade80] text-black font-bold text-sm hover:bg-[#22c55e] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Реєструємось...
                </>
              ) : "Зареєструватись"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[var(--muted)]">
            Вже є акаунт?{" "}
            <Link href="/auth/login" className="text-[#4ade80] font-semibold hover:underline">
              Увійти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
