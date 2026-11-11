import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowIcon } from '../components/Brand';
import { PageHeader } from '../components/PageHeader';
import { Photo } from '../components/Photo';
import { CATEGORY_LABELS, PORTFOLIO, type Category } from '../content/photos';
import { Flip, gsap, useGSAP } from '../lib/gsap';
import { cn, MEDIA, prefersReducedMotion } from '../lib/motion';
import { useLenis } from '../lib/smooth-scroll';
import { BookingCall } from './Home';

type Filter = Category | 'all';
const FILTERS: Filter[] = ['all', 'celebrations', 'couples', 'portraits', 'details'];

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const items = useMemo(() => PORTFOLIO.filter((p) => filter === 'all' || p.category === filter), [filter]);

  // Tiles fade/scale in as they scroll into view
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-tile]', grid.current).forEach((tile) => {
          // tiles already on screen at load stay put; the rest rise in as you scroll
          if (tile.getBoundingClientRect().top < window.innerHeight) return;
          gsap.from(tile, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: tile, start: 'top 92%', once: true },
          });
        });
      });
    },
    { scope: grid },
  );

  // Filtering: tiles glide to their new places (Flip)
  const choose = (f: Filter) => {
    if (f === filter) return;
    if (!prefersReducedMotion() && grid.current) {
      flipState.current = Flip.getState(grid.current.querySelectorAll('[data-tile]'));
    }
    setFilter(f);
  };
  useLayoutEffect(() => {
    if (!flipState.current || !grid.current) return;
    Flip.from(flipState.current, {
      targets: grid.current.querySelectorAll('[data-tile]'),
      duration: 0.7,
      ease: 'expo.inOut',
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
    });
    flipState.current = null;
  }, [filter]);

  return (
    <>
      <PageHeader eyebrow="Portfolio" id="portfolio-title" title={<>Moments, <em className="text-brass">kept</em>.</>}>
        Celebrations, couples, portraits and the rooms they happened in. Tap any photo to see it full size.
      </PageHeader>

      <section aria-labelledby="portfolio-title" className="pb-24 md:pb-36">
        <div className="wrap">
          <div role="group" aria-label="Filter the portfolio" className="mb-10 flex flex-wrap gap-2 border-b border-line pb-6 md:mb-14">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => choose(f)}
                className={cn(
                  'h-11 rounded-full border px-5 text-[0.75rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300',
                  filter === f ? 'border-brass bg-brass text-ink' : 'border-line-strong text-paper hover:border-brass hover:text-brass-light',
                )}
              >
                {CATEGORY_LABELS[f]}
              </button>
            ))}
          </div>

          <ul ref={grid} className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
            {items.map((item, i) => (
              <li key={item.name} data-tile="" data-flip-id={item.name} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  data-cursor="View"
                  className="group block w-full overflow-hidden text-left"
                >
                  <span className="block overflow-hidden">
                    <Photo
                      name={item.name}
                      alt={item.alt}
                      priority={i < 3}
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                      flipId={`photo-${item.name}`}
                      className="block"
                      imgClassName="h-auto w-full transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-3 flex justify-between text-xs text-mist">
                    <span>{item.caption}</span>
                    <span aria-hidden="true" className="text-brass opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      View
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {open !== null ? <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} /> : null}

      <BookingCall />
    </>
  );
}

type LightboxProps = {
  items: typeof PORTFOLIO;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Full-size view. The tapped photo grows out of its tile and shrinks back when closed. */
function Lightbox({ items, index, onIndex, onClose }: LightboxProps) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const item = items[index];
  const returnFocus = useRef<HTMLElement | null>(null);
  const firstOpen = useRef(true);

  const flipFromTile = () => {
    if (prefersReducedMotion()) return;
    const tileImg = document.querySelector<HTMLElement>(`[data-tile] [data-flip-id="photo-${item.name}"]`);
    const big = root.current?.querySelector<HTMLElement>('[data-stage] img');
    if (!tileImg || !big) return;
    const state = Flip.getState(tileImg);
    Flip.from(state, { targets: big, duration: 0.65, ease: 'expo.inOut', scale: true, absolute: true });
  };

  useLayoutEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    if (!prefersReducedMotion()) gsap.fromTo(root.current, { backgroundColor: 'rgba(11,10,9,0)' }, { backgroundColor: 'rgba(11,10,9,0.96)', duration: 0.5 });
    flipFromTile();
    closeBtn.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      returnFocus.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Next/previous: a quick cross-fade
  useLayoutEffect(() => {
    if (firstOpen.current) {
      firstOpen.current = false;
      return;
    }
    if (!prefersReducedMotion()) gsap.fromTo(root.current!.querySelector('[data-stage] img'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'expo.out' });
  }, [index]);

  const close = () => {
    const big = root.current?.querySelector<HTMLElement>('[data-stage] img');
    const tileImg = document.querySelector<HTMLElement>(`[data-tile] [data-flip-id="photo-${item.name}"]`);
    if (prefersReducedMotion() || !big || !tileImg) return onClose();
    const r = tileImg.getBoundingClientRect();
    const b = big.getBoundingClientRect();
    gsap
      .timeline({ onComplete: onClose })
      .to(big, {
        x: r.left + r.width / 2 - (b.left + b.width / 2),
        y: r.top + r.height / 2 - (b.top + b.height / 2),
        scale: r.width / b.width,
        duration: 0.55,
        ease: 'expo.inOut',
      })
      .to(root.current, { backgroundColor: 'rgba(11,10,9,0)', duration: 0.4 }, 0.15)
      .to(root.current!.querySelectorAll('[data-chrome]'), { opacity: 0, duration: 0.2 }, 0);
  };

  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Tab' && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>('button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[75] flex flex-col bg-ink-deep/95"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div data-chrome="" className="wrap flex h-16 items-center justify-between md:h-20">
        <p className="text-xs tracking-[0.2em] text-mist uppercase">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          className="flex h-11 items-center gap-3 rounded-full border border-line-strong px-5 text-xs font-semibold tracking-[0.18em] uppercase hover:border-brass"
        >
          Close <span aria-hidden="true">✕</span>
        </button>
      </div>
      <div
        data-stage=""
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <Photo
          key={item.name}
          name={item.name}
          alt={item.alt}
          sizes="90vw"
          priority
          flipId={`photo-${item.name}`}
          className="contents"
          imgClassName="max-h-full w-auto max-w-full object-contain"
          imgStyle={{ maxHeight: 'calc(100svh - 10rem)' }}
        />
      </div>
      <div data-chrome="" className="wrap flex h-20 items-center justify-between">
        <p className="text-sm text-mist">{item.caption}</p>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line-strong hover:border-brass">
            <ArrowIcon className="-rotate-135" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line-strong hover:border-brass">
            <ArrowIcon className="rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
