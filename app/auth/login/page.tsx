'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Невірний формат email'),
  password: z.string().min(1, 'Введи пароль'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Невірний email або пароль')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Підтверди email перед входом')
        } else {
          toast.error(error.message)
        }
        return
      }
      toast.success('Ласкаво просимо!')
      router.push('/cabinet')
      router.refresh()
    } catch {
      toast.error('Щось пішло не так. Спробуй ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-4">
            <span className="text-3xl">⛏️</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Вхід до SITAO</h1>
          <p className="text-[var(--muted)] mt-2 text-sm">Введи свої дані щоб продовжити</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  autoComplete="current-password"
                  {...register('password')}
                  className="w-full px-4 py-2.5 pr-11 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--accent)] text-[#0f1117] font-semibold rounded-lg hover:bg-[var(--accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? 'Входимо...' : 'Увійти'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Немає акаунту?{' '}
          <Link href="/auth/register" className="text-[var(--accent)] hover:underline font-medium">
            Зареєструватись
          </Link>
        </p>
      </div>
    </div>
  )
}
