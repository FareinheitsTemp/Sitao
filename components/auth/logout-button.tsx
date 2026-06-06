'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Помилка виходу')
      return
    }
    toast.success('Ти вийшов з акаунту')
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className={className}>
      {children ?? 'Вийти'}
    </button>
  )
}
