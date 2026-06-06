"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconEye, IconEyeOff, IconUser, IconLock } from "@tabler/icons-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.login || !form.password) {
      setError("Заповни всі поля");
      return;
    }
    setLoading(true);
    // TODO: підключи реальний API тут
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setError("Невірний логін або пароль"); // placeholder
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
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
        {/* Card */}
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-7 sm:p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="font-black text-2xl tracking-tight mb-1">
              <span className="text-[#4ade80]">SITAO</span>
              <span className="text-[var(--muted)]">.fun</span>
            </div>
            <p className="text-sm text-[var(--muted)]">Увійди у свій акаунт</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                Нікнейм або Email
              </label>
              <div className="relative">
                <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="Steve або steve@mail.com"
                  value={form.login}
                  onChange={(e) => setForm({ ...form, login: e.target.value })}
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                  Входимо...
                </>
              ) : "Увійти"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-[var(--muted)]">
            Ще немає акаунту?{" "}
            <Link href="/auth/register" className="text-[#4ade80] font-semibold hover:underline">
              Зареєструватись
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
