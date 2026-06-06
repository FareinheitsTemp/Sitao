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
    .min(3, 'Нікнейм мінімум 3 символи')
    .max(16, 'Нікнейм максимум 16 символів')
    .regex(/^[a-zA-Z0-9_]+$/, 'Тільки латинські літери, цифри і _ (підкреслення)'),
  email: z.string().email('Невірний формат email'),
  password: z
    .string()
    .min(8, 'Пароль мінімум 8 символів')
    .regex(/[A-Z]/, 'Пароль повинен містити хоча б одну велику літеру')
    .regex(/[0-9]/, 'Пароль повинен містити хоча б одну цифру'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nickname: data.nickname,
          },
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
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Перевір пошту!</h1>
          <p className="text-muted-foreground">
            Ми надіслали листа з підтвердженням на твою адресу.
            Перейди по посиланню щоб активувати акаунт.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-6 text-primary hover:underline font-medium"
          >
            Повернутись до входу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Реєстрація</h1>
          <p className="text-muted-foreground mt-2">Створи акаунт на SITAO</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-foreground mb-1">
              Нікнейм
            </label>
            <input
              id="nickname"
              type="text"
              autoComplete="username"
              {...register('nickname')}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Steve123"
            />
            {errors.nickname && (
              <p className="mt-1 text-sm text-destructive">{errors.nickname.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              3–16 символів, лише латиниця, цифри, _
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Мін. 8 символів, одна велика літера, одна цифра
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
              Підтвердження пароля
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Реєструємось...' : 'Зареєструватись'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Вже є акаунт?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  )
}
