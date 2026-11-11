// Adapted from "Hover Image List" on 21st.dev (SmoothUI by Eduardo Calvo).
// Restyled for FotoJoe: big Fraunces rows, brass index numbers, Joe's photos.
// Phones and keyboard users get a fixed preview instead of a cursor-follower.
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react';
import { Link } from 'wouter';
import type { PhotoName } from '../content/photos';
import { cn } from '../lib/motion';
import { ArrowIcon } from './Brand';
import { photoSrc } from './Photo';

export type HoverItem = { id: string; title: string; meta?: string; href: string; image: PhotoName; alt: string };

const SPRING = { damping: 26, stiffness: 260 };
const SKEW_SPRING = { damping: 18, stiffness: 220 };
const W = 300;
const H = 380;

export function HoverImageList({ items, className }: { items: HoverItem[]; className?: string }) {
  const reduce = useReducedMotion();
  const [hoverDevice, setHoverDevice] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [source, setSource] = useState<'pointer' | 'focus' | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<{ t: number; x: number } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skew = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const sskew = useSpring(skew, SKEW_SPRING);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHoverDevice(mq.matches);
    const on = (e: MediaQueryListEvent) => setHoverDevice(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const fixed = reduce || !hoverDevice || source === 'focus';

  const onMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (fixed || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      const now = performance.now();
      if (last.current) {
        const dt = Math.min(now - last.current.t, 50);
        if (dt > 0) skew.set(Math.max(-8, Math.min(8, ((lx - last.current.x) / dt) * 0.12 * 10)));
      }
      last.current = { t: now, x: lx };
      x.set(lx - W / 2);
      y.set(ly - H / 2);
    },
    [fixed, skew, x, y],
  );

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (source === 'focus' && !e.currentTarget.contains(e.relatedTarget)) {
      setActive(null);
      setSource(null);
    }
  };

  const item = active === null ? null : items[active];

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onPointerMove={onMove}
      onPointerLeave={() => {
        setActive(null);
        setSource(null);
        last.current = null;
      }}
      onBlur={onBlur}
    >
      <ul className="border-t border-line">
        {items.map((it, i) => (
          <li key={it.id} className="border-b border-line">
            <Link
              href={it.href}
              className="group relative z-10 flex items-baseline gap-4 py-5 md:gap-8 md:py-7"
              onFocus={() => {
                setActive(i);
                setSource('focus');
              }}
              onMouseEnter={() => {
                if (hoverDevice) {
                  setActive(i);
                  setSource('pointer');
                }
              }}
            >
              <span className="w-8 shrink-0 font-display text-sm italic text-brass md:w-12 md:text-base">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 font-display text-[clamp(1.6rem,3.6vw,3.4rem)] leading-none tracking-tight text-paper transition-[transform,color] duration-500 ease-(--ease-expo) group-hover:translate-x-3 group-hover:text-brass-light group-focus-visible:translate-x-3">
                {it.title}
              </span>
              {it.meta ? <span className="hidden text-sm text-mist md:block">{it.meta}</span> : null}
              <ArrowIcon className="h-4 w-4 shrink-0 text-brass opacity-40 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <m.div
          className={cn('absolute overflow-hidden rounded-[3px] shadow-2xl shadow-black/60', fixed && 'top-1/2 right-0 -translate-y-1/2 max-md:hidden')}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
          animate={reduce ? { opacity: item ? 1 : 0 } : { opacity: item ? 1 : 0, scale: item ? 1 : 0.9 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0.1, duration: 0.3 }}
          style={fixed ? { width: W * 0.8, height: H * 0.8 } : { width: W, height: H, left: 0, top: 0, x: sx, y: sy, skewX: sskew }}
        >
          <AnimatePresence initial={false}>
            {item ? (
              <m.img
                key={item.id}
                src={photoSrc(item.image, 480)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : null}
          </AnimatePresence>
        </m.div>
      </div>
    </div>
  );
}
