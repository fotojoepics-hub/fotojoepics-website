import { domAnimation, LazyMotion } from 'motion/react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Route, Router, Switch, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Intro } from './components/Intro';
import { ViewCursor } from './components/motion/ViewCursor';
import { gsap, ScrollTrigger } from './lib/gsap';
import { MEDIA } from './lib/motion';
import { metaFor } from './lib/seo';
import { SmoothScroll, useLenis } from './lib/smooth-scroll';
import { About } from './pages/About';
import { Book } from './pages/Book';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Portfolio } from './pages/Portfolio';
import { Services } from './pages/Services';

const HASH = import.meta.env.MODE === 'artifact';

export function App({ ssrPath }: { ssrPath?: string }) {
  const routerProps = HASH ? { hook: useHashLocation, hrefs: (href: string) => `#${href}` } : { ssrPath };
  return (
    <Router {...routerProps}>
      <LazyMotion features={domAnimation} strict>
        <SmoothScroll>
          <Shell />
        </SmoothScroll>
      </LazyMotion>
    </Router>
  );
}

function Shell() {
  const [location] = useLocation();
  const lenis = useLenis();
  const wipe = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Page change: a quick ink wipe lifts off the new page, scroll returns to top
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const hash = typeof window !== 'undefined' && !HASH ? window.location.hash : '';
    if (hash) {
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
    } else {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    if (wipe.current && !window.matchMedia(MEDIA.reduce).matches) {
      gsap.fromTo(
        wipe.current,
        { scaleY: 1, transformOrigin: '50% 0%' },
        { scaleY: 0, duration: 0.6, ease: 'expo.inOut', delay: 0.05 },
      );
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location, lenis]);

  useEffect(() => {
    const m = metaFor(location);
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
  }, [location]);

  useEffect(() => {
    // The safety timer (index.html) stays armed while an intro is pending; the intro clears it.
    if (!document.documentElement.classList.contains('intro')) {
      clearTimeout((window as unknown as { __fjSafety?: number }).__fjSafety);
    }
    document.documentElement.classList.add('app-ready');
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById('main');
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <Header />
      <Intro />
      <ViewCursor />
      <main id="main" tabIndex={-1} className="outline-none">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/services" component={Services} />
          <Route path="/about" component={About} />
          <Route path="/book" component={Book} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
      <div
        ref={wipe}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85] origin-top scale-y-0 border-b border-brass/60 bg-ink-deep"
      />
    </>
  );
}
