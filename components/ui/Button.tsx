'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass' | 'cyan'
type Size    = 'sm' | 'md' | 'lg' | 'icon'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  glow?: boolean
  children?: ReactNode
  asChild?: boolean
}

const BASE = [
  'relative inline-flex items-center justify-center gap-2 font-semibold',
  'transition-all duration-200 cursor-pointer select-none',
  'focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  'active:scale-[0.96]',
].join(' ')

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-lt)] shadow-[0_0_20px_var(--accent-glow)]',
  secondary: 'bg-transparent text-[var(--foreground)] border border-[var(--border-lt)] rounded-xl hover:bg-[var(--surface-2)] hover:border-[var(--accent-dim)]',
  ghost:     'bg-transparent text-[var(--muted-lt)] rounded-xl hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]',
  danger:    'bg-[var(--error)] text-white rounded-xl hover:opacity-90 shadow-[0_0_16px_rgba(239,68,68,0.3)]',
  glass:     'glass text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-2)]/60',
  cyan:      'bg-[var(--cyan)] text-[#030710] rounded-xl hover:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.3)]',
}

const SIZES: Record<Size, string> = {
  sm:   'px-3 py-1.5 text-xs min-h-[32px]',
  md:   'px-5 py-2.5 text-sm min-h-[40px]',
  lg:   'px-7 py-3.5 text-base min-h-[48px]',
  icon: 'p-2.5 min-w-[40px] min-h-[40px] rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, glow, className = '', children, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${glow ? 'btn-glow' : ''} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span>Завантаження...</span>
        </>
      ) : children}
    </motion.button>
  )
})
