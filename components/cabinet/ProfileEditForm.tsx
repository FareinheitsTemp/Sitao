'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

const editSchema = z.object({
  display_name: z.string().max(32, 'Максимум 32 символи').optional().or(z.literal('')),
  avatar_url: z.string().url('Невірний URL').optional().or(z.literal('')),
})

type EditForm = z.infer<typeof editSchema>

interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  nickname: string
}

export function ProfileEditForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      display_name: profile.display_name ?? '',
      avatar_url: profile.avatar_url ?? '',
    },
  })

  const onSubmit = async (data: EditForm) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name || null,
          avatar_url: data.avatar_url || null,
        })
        .eq('id', profile.id)

      if (error) {
        toast.error('Помилка збереження')
        return
      }
      toast.success('Профіль оновлено!')
    } catch {
      toast.error('Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-5">Редагувати профіль</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">Відображуване ім'я</label>
          <input
            type="text"
            {...register('display_name')}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder={profile.nickname}
          />
          {errors.display_name && <p className="mt-1.5 text-xs text-red-400">{errors.display_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">URL аватара</label>
          <input
            type="url"
            {...register('avatar_url')}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="https://example.com/avatar.png"
          />
          {errors.avatar_url && <p className="mt-1.5 text-xs text-red-400">{errors.avatar_url.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !isDirty}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[#0f1117] font-semibold text-sm rounded-lg hover:bg-[var(--accent-dim)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <span className="w-4 h-4 border-2 border-[#0f1117]/30 border-t-[#0f1117] rounded-full animate-spin" /> : <Save size={16} />}
          {loading ? 'Зберігаємо...' : 'Зберегти'}
        </button>
      </form>
    </div>
  )
}
