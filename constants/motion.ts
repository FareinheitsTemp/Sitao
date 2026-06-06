import type { Variants, Transition } from 'framer-motion'

export const EASE_OUT  = [0.16, 1, 0.3, 1] as const
export const EASE_IN   = [0.4, 0, 1, 1] as const
export const EASE_IO   = [0.4, 0, 0.2, 1] as const

export const TRANSITION_DEFAULT: Transition = { duration: 0.55, ease: EASE_OUT }
export const TRANSITION_FAST:    Transition = { duration: 0.28, ease: EASE_OUT }
export const TRANSITION_SLOW:    Transition = { duration: 0.8,  ease: EASE_OUT }
export const TRANSITION_SPRING:  Transition = { type: 'spring', stiffness: 300, damping: 26 }
export const TRANSITION_SPRING_TIGHT: Transition = { type: 'spring', stiffness: 420, damping: 34 }

// ── Base variants ──────────────────────────────────
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION_DEFAULT },
}

export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT },
}

export const fadeInDown: Variants = {
  hidden:  { opacity: 0, y: -28 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1,  transition: TRANSITION_SPRING },
}

export const scaleInFast: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,  transition: TRANSITION_SPRING_TIGHT },
}

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0,  transition: TRANSITION_DEFAULT },
}

export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0,  transition: TRANSITION_DEFAULT },
}

export const blurIn: Variants = {
  hidden:  { opacity: 0, filter: 'blur(8px)', y: 12 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0,  transition: TRANSITION_SLOW },
}

// ── Stagger containers ─────────────────────────────
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055 } },
}

export const staggerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
}

// ── Page shell ─────────────────────────────────────
export const pageEnter: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
}

// ── Modal ──────────────────────────────────────────
export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
}

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.9,  y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: TRANSITION_SPRING },
  exit:    { opacity: 0, scale: 0.92, y: 12, transition: TRANSITION_FAST },
}

// ── Node expand (rules constellation) ─────────────
export const nodeExpand: Variants = {
  hidden:  { opacity: 0, scale: 0,    transition: TRANSITION_FAST },
  visible: { opacity: 1, scale: 1,    transition: TRANSITION_SPRING },
  exit:    { opacity: 0, scale: 0.5,  transition: TRANSITION_FAST },
}

// ── Notification toast ─────────────────────────────
export const toastVariants: Variants = {
  hidden:  { opacity: 0, x: 40,  scale: 0.92 },
  visible: { opacity: 1, x: 0,   scale: 1,   transition: TRANSITION_SPRING },
  exit:    { opacity: 0, x: 40,  scale: 0.92, transition: TRANSITION_FAST },
}
