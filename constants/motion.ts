export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const TRANSITION_DEFAULT = { duration: 0.6, ease: EASE_OUT };
export const TRANSITION_FAST    = { duration: 0.3, ease: EASE_OUT };
export const TRANSITION_SPRING  = { type: 'spring' as const, stiffness: 280, damping: 24 };

export const fadeInUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT },
};
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION_DEFAULT },
};
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: TRANSITION_SPRING },
};
export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: TRANSITION_DEFAULT },
};
export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: TRANSITION_DEFAULT },
};
export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
