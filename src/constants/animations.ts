export const ANIMATION_SCALE = {
  HIDDEN: 0.7,
  VISIBLE: 1,
  STACK_REDUCTION: 0.05,
} as const;

export const ANIMATION_DURATION = {
  FAST: 0.15,
  QUICK: 0.25,
  NORMAL: 0.3,
  SLOW: 0.4,
} as const;

export const ANIMATION_TIMEOUT = {
  SHORT: 150,
} as const;

export const ANIMATION_OFFSET = {
  VERTICAL: 32,
  INITIAL_Y: -100,
  COLLAPSED_SPACING: 14,
} as const;

export const TOAST_SPACING = {
  COLLAPSED: 8,
  EXPANDED: 8,
} as const;

export const TOAST_DEFAULTS = {
  HEIGHT: 80,
  BOX_SHADOW: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  BOX_SHADOW_HIDDEN: '0px 0px 0px rgba(0, 0, 0, 0)',
  AUTO_DISMISS_ENABLED: false,
  AUTO_DISMISS_DURATION: 4000, // 4 seconds
} as const;

export const SPRING_CONFIG = {
  stiffness: 400,
  damping: 25,
} as const;

export const TRANSITIONS = {
  FAST_EASE_OUT: { duration: ANIMATION_DURATION.FAST, ease: 'easeOut' },
  QUICK_EASE_OUT: { duration: ANIMATION_DURATION.QUICK, ease: 'easeOut' },
  NORMAL_EASE_OUT: { duration: ANIMATION_DURATION.NORMAL, ease: 'easeOut' },
  NORMAL_EASE_IN_OUT: { duration: ANIMATION_DURATION.NORMAL, ease: 'easeInOut' },
  SLOW_EASE_OUT: { duration: ANIMATION_DURATION.SLOW, ease: 'easeOut' },
  SLOW_SPRING: { duration: ANIMATION_DURATION.SLOW, ease: 'easeOut', type: 'spring' as const, ...SPRING_CONFIG },
} as const;
