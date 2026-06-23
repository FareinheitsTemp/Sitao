'use client'

import { useServerStatus } from '@/hooks/use-server-status'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  /** Show player count. Default: true */
  showCount?: boolean
  /** Polling interval ms. Default: 30_000 */
  interval?: number
  className?: string
}

export default function ServerStatusBadge({
  showCount = true,
  interval  = 30_000,
  className = '',
}: Props) {
  const { data, loading } = useServerStatus({ interval })

  return (
    <AnimatePresence mode="wait">
      {loading && !data ? (
        <motion.span
          key="skeleton"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className={`inline-flex items-center gap-1.5 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-lt)] animate-pulse" />
          <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">...</span>
        </motion.span>
      ) : (
        <motion.span
          key="status"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className={`inline-flex items-center gap-1.5 ${className}`}
        >
          {/* Dot */}
          <span className="relative flex h-1.5 w-1.5">
            {data?.online && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3d6bff] opacity-60" />
            )}
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: data?.online ? '#3d6bff' : '#374151' }}
            />
          </span>

          {/* Label */}
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-lt)]">
            {data?.online
              ? showCount && data.players.online > 0
                ? `${data.players.online} online`
                : 'online'
              : 'offline'
            }
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
