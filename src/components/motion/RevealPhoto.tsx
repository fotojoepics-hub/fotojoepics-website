import { useRef } from 'react';
import type { PhotoName } from '../../content/photos';
import { gsap, useGSAP } from '../../lib/gsap';
import { cn, MEDIA } from '../../lib/motion';
import { Photo } from '../Photo';

type Props = {
  name: PhotoName;
  alt: string;
  sizes?: string;
  className?: string;
  /** slow drift of the photo inside its frame while scrolling */
  parallax?: boolean;
  priority?: boolean;
  cursorLabel?: string;
  objectPosition?: string;
};

/** "Print being uncovered": the frame wipes open while the photo inside settles
 *  from a slight zoom. Optional quiet parallax. Three layers so each has one owner. */
export function RevealPhoto({ name, alt, sizes, className, parallax = true, priority, cursorLabel, objectPosition }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const frame = ref.current!;
      const settle = frame.querySelector<HTMLElement>('[data-settle]');
      const img = frame.querySelector<HTMLElement>('img');
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 90%', once: true } });
        tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }).fromTo(
          settle,
          { scale: 1.18 },
          { scale: 1, duration: 1.6, ease: 'expo.out' },
          0.15,
        );
        if (parallax && img) {
          gsap.fromTo(
            img,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
            },
          );
        }
      });
      mm.add(MEDIA.reduce, () => {
        gsap.set(frame, { clipPath: 'none' });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-reveal="" data-cursor={cursorLabel} className={cn('relative overflow-hidden', className)}>
      <div data-settle="" className="h-full w-full">
        <Photo
          name={name}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className="block h-full w-full"
          imgClassName={cn('w-full object-cover', parallax ? 'h-[112%] -mt-[6%]' : 'h-full')}
          imgStyle={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    </div>
  );
}
