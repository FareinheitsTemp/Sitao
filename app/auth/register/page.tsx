'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const registerSchema = z.object({
  nickname: z
    .string()
    .min(3, 'Мінімум 3 символи')
    .max(16, 'Максимум 16 символів')
    .regex(/^[a-zA-Z0-9_]+$/, 'Тільки латинські літери, цифри і _'),
  email: z.string().email('Невірний формат email'),
  password: z
    .string()
    .min(8, 'Мінімум 8 символів')
    .regex(/[A-Z]/, 'Потрібна хоча б одна велика літера')
    .regex(/[0-9]/, 'Потрібна хоча б одна цифра'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  const passwordStrength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^a-zA-Z0-9]/.test(password)) s++
    return s
  })()

  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-[var(--accent)]'][passwordStrength]
  const strengthText  = ['', 'Слабкий', 'Середній', 'Добрий', 'Надійний'][passwordStrength]
  const strengthTextColor = ['', 'text-red-500', 'text-yellow-500', 'text-blue-400', 'text-[var(--accent)]'][passwordStrength]

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { nickname: data.nickname },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message.includes('User already registered')
          ? 'Цей email вже зареєстрований'
          : error.message
        )
        return
      }
      setSuccess(true)
    } catch {
      toast.error('Щось пішло не так. Спробуй ще раз.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--surface)] border border-[var(--accent)]/40 mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-3">Перевір пошту!</h1>
          <p className="text-[var(--muted)] leading-relaxed">
            Ми надіслали листа з підтвердженням на твою адресу.
            Перейди по посиланню щоб активувати акаунт.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-8 px-6 py-2.5 bg-[var(--accent)] text-[#0f1117] font-semibold rounded-lg hover:bg-[var(--accent-dim)] transition-colors"
          >
            Повернутись до входу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Реєстрація</h1>
          <p className="text-[var(--muted)] mt-2 text-sm">Створи свій акаунт на SITAO</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Нікнейм</label>
              <input
                type="text"
                autoComplete="username"
                {...register('nickname')}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Steve123"
              />
              {errors.nickname
                ? <p className="mt-1.5 text-xs text-red-400">{errors.nickname.message}</p>
                : <p className="mt-1.5 text-xs text-[var(--muted)]">3–16 символів, лише латиниця, цифри, _</p>
              }
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full px-4 py-2.5 pr-11 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength ? strengthColor : 'bg-[var(--border)]'
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strengthTextColor}`}>{strengthText}</p>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Підтвердження пароля</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-2.5 pr-11 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  {showConfirm ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--accent)] text-[#0f1117] font-semibold rounded-lg hover:bg-[var(--accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" />
                : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                )
              }
              {loading ? 'Реєструємось...' : 'Зареєструватись'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Вже є акаунт?{' '}
          <Link href="/auth/login" className="text-[var(--accent)] hover:underline font-medium">Увійти</Link>
        </p>
      </div>
    </div>
  )
}
