'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

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

export default function RegisterPage() {
  const router = useRouter()
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
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++
    return score
  })()

  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-[var(--accent)]']
  const strengthLabels = ['', 'Слабкий', 'Середній', 'Добрий', 'Надійний']

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
        if (error.message.includes('User already registered')) {
          toast.error('Цей email вже зареєстрований')
        } else {
          toast.error(error.message)
        }
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-6">
            <span className="text-4xl">📧</span>
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-4">
            <span className="text-3xl">🎮</span>
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-[var(--border)]'
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strengthColors[passwordStrength].replace('bg-', 'text-')}`}>
                    {strengthLabels[passwordStrength]}
                  </p>
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
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--accent)] text-[#0f1117] font-semibold rounded-lg hover:bg-[var(--accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" />
              ) : (
                <UserPlus size={18} />
              )}
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
