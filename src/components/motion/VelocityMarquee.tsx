import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { cn, MEDIA } from '../../lib/motion';

/** A slow ribbon of words that speeds up — and changes direction — with your scroll.
 *  Static for reduced-motion. */
export function VelocityMarquee({ items, className }: { items: readonly string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current!.querySelector<HTMLElement>('[data-track]')!;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        let x = 0;
        let dir = -1;
        let boost = 0;
        const setX = gsap.quickSetter(track, 'xPercent');
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            dir = self.direction === 1 ? -1 : 1;
            boost = Math.min(Math.abs(self.getVelocity()) / 260, 6);
          },
        });
        const tick = (_t: number, dt: number) => {
          boost *= 0.94;
          x += dir * (0.012 + boost * 0.03) * (dt / 16.67);
          if (x <= -50) x += 50;
          if (x > 0) x -= 50;
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: ref },
  );

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it} className="flex items-center">
          <span className="px-6 font-display text-[clamp(2.2rem,5.4vw,5.2rem)] leading-none font-[340] italic md:px-10">{it}</span>
          <span className="text-brass" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className={cn('overflow-hidden py-8 md:py-12', className)}>
      <p className="sr-only">Services: {items.join(', ')}</p>
      <div data-track="" className="flex w-max text-brass-light/90 will-change-transform" aria-hidden="true">
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
