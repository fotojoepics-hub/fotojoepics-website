// Shared motion language — every animation on the site uses these.
export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'expo.inOut',
  scrub: 'none',
} as const;

export const DUR = {
  ui: 0.3,
  reveal: 0.9,
  hero: 1.2,
} as const;

export const STAGGER = 0.08;

export const MEDIA = {
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(MEDIA.reduce).matches;
}

export function finePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}
