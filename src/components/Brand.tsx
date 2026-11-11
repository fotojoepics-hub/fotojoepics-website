import { SIGNATURE_HEIGHT, SIGNATURE_PATH, SIGNATURE_WIDTH } from '../brand/signature';
import { cn } from '../lib/motion';

export function Signature({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIGNATURE_WIDTH} ${SIGNATURE_HEIGHT}`}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      <path d={SIGNATURE_PATH} />
    </svg>
  );
}

export function CameraIcon({ className, strokeWidth = 3, drawable = false }: { className?: string; strokeWidth?: number; drawable?: boolean }) {
  const p = drawable ? { pathLength: 1, strokeDasharray: 1 } : {};
  return (
    <svg
      viewBox="0 0 64 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="13" width="56" height="31" rx="6" {...p} />
      <path d="M22 13l4-7h12l4 7" {...p} />
      <circle cx="32" cy="28" r="9" {...p} />
      <circle cx="32" cy="28" r="3.5" {...p} />
    </svg>
  );
}

/** Header/footer lockup: signature + small brass camera. */
export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <span className={cn('inline-flex items-end gap-2 text-paper', className)}>
      <Signature className={size === 'lg' ? 'h-24 w-auto md:h-36' : 'h-9 w-auto md:h-11'} />
      <CameraIcon className={cn('text-brass', size === 'lg' ? 'mb-3 w-9 md:mb-5 md:w-12' : 'mb-1 w-5')} />
    </span>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn('h-3.5 w-3.5', className)} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 13L13 3M5.5 3H13v7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
