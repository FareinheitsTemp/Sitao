'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const schema = z.object({
  display_name:   z.string().max(32, 'Максимум 32 символи').optional().or(z.literal('')),
  minecraft_name: z.string().max(16, 'Максимум 16 символів').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

type Profile = {
  id: string
  display_name: string | null
  minecraft_name: string | null
}

export function ProfileEditForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name:   profile.display_name   ?? '',
      minecraft_name: profile.minecraft_name ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name:   data.display_name   || null,
        minecraft_name: data.minecraft_name || null,
      })
      .eq('id', profile.id)

    if (error) {
      toast.error('Помилка збереження: ' + error.message)
    } else {
      toast.success('Профіль оновлено!')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6"
    >
      <h2 className="text-sm font-bold text-[var(--foreground)] mb-5 flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Редагувати профіль
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Display name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
            Відображуване ім&apos;я
          </label>
          <input
            type="text"
            {...register('display_name')}
            placeholder="Твоє ім&apos;я на сайті"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
          />
          {errors.display_name && <p className="mt-1.5 text-xs text-red-400">{errors.display_name.message}</p>}
          <p className="mt-1.5 text-xs text-[var(--muted)]">Показується замість нікнейму скрізь на сайті</p>
        </div>

        {/* Minecraft name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
            Нік у Minecraft
          </label>
          <input
            type="text"
            {...register('minecraft_name')}
            placeholder="Steve"
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
          />
          {errors.minecraft_name && <p className="mt-1.5 text-xs text-red-400">{errors.minecraft_name.message}</p>}
          <p className="mt-1.5 text-xs text-[var(--muted)]">Для прив&apos;язки до ігрового акаунту</p>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4ade80] text-[#0f1117] text-sm font-bold rounded-xl hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" />
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {loading ? 'Зберігаємо...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
