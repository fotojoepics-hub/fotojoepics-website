import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { MEDIA } from './motion';

const LenisContext = createContext<Lenis | null>(null);

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 *  Off entirely for people who prefer reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia(MEDIA.reduce).matches) return;
    const instance = new Lenis({ autoRaf: false, anchors: { offset: -96 }, lerp: 0.1 });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const cls = document.documentElement.classList;
    let failsafe: number | undefined;
    if (cls.contains('intro') || cls.contains('intro-playing')) {
      instance.stop();
      // never leave scrolling locked if the intro could not load
      failsafe = window.setTimeout(() => {
        if (!cls.contains('intro-playing')) instance.start();
      }, 6000);
    }
    setLenis(instance);
    return () => {
      clearTimeout(failsafe);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}

/** Scrolls smoothly when Lenis is running, natively otherwise. */
export function scrollToTarget(lenis: Lenis | null, target: string | number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -96, immediate, duration: 1.2 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}
