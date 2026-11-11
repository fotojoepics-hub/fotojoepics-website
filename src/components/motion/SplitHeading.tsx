import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '../../lib/gsap';
import { DUR, EASE, MEDIA, STAGGER } from '../../lib/motion';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  /** 'scroll' = lines rise when it enters the screen; 'load' = first-screen title, rises with CSS as soon as the page paints */
  play?: 'scroll' | 'load';
};

/** Headline whose lines rise out of a mask, one after another. Headlines only. */
export function SplitHeading({ as: Tag = 'h2', children, className, id, delay = 0, play = 'scroll' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || play === 'load') return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: 'visible' });
            const tween = gsap.from(self.lines, {
              yPercent: 115,
              duration: DUR.reveal,
              ease: EASE.expo,
              stagger: STAGGER,
              delay,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            });
            return tween;
          },
        });
        return () => split.revert();
      });
      mm.add(MEDIA.reduce, () => {
        gsap.set(el, { visibility: 'visible' });
      });
    },
    { scope: ref },
  );

  if (play === 'load') {
    return (
      <Tag ref={ref} id={id} className={className} data-rise="" style={{ '--d': `${0.1 + delay}s` } as CSSProperties}>
        {children}
      </Tag>
    );
  }
  return (
    <Tag ref={ref} id={id} className={className} data-split="">
      {children}
    </Tag>
  );
}
