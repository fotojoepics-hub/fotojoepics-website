import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { finePointer } from '../../lib/motion';

/** Desktop only: a small brass "View" disc follows the cursor over photos
 *  marked with data-cursor="…". The normal cursor stays visible. */
export function ViewCursor() {
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!finePointer()) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(target?.dataset.cursor || null);
    };
    const leave = () => setLabel(null);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', leave, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', leave);
      document.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <m.div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[80]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label ? (
          <m.div
            key="disc"
            className="grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brass text-[0.68rem] font-bold tracking-[0.18em] text-ink uppercase"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {label}
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.div>
  );
}
