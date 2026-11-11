import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { BUSINESS, NAV } from '../content/site';
import { cn } from '../lib/motion';
import { useLenis } from '../lib/smooth-scroll';
import { Logo } from './Brand';
import { MagneticButton } from './MagneticButton';

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path
        d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Slim header that stays on screen everywhere — the Book button is never more than one tap away. */
export function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-60 transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled && !open ? 'border-b border-line/70 bg-ink/80 backdrop-blur-md' : 'border-b border-transparent',
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" data-logo="" aria-label="Foto Joe — home" className="relative z-10 -my-2 py-2">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-intro-item=""
                aria-current={location === item.href ? 'page' : undefined}
                className="link text-[0.8rem] font-semibold tracking-[0.16em] uppercase"
              >
                {item.label}
              </Link>
            ))}
            <a href={BUSINESS.phoneHref} data-intro-item="" className="link text-[0.8rem] font-semibold tracking-[0.08em] text-mist">
              {BUSINESS.phoneDisplay}
            </a>
            <MagneticButton href="/book" size="sm" data-intro-item>
              Book
            </MagneticButton>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <a
              href={BUSINESS.phoneHref}
              data-intro-item=""
              aria-label={`Call or text ${BUSINESS.phoneDisplay}`}
              className="grid h-11 w-11 place-items-center rounded-full text-brass"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
            <Link
              href="/book"
              data-intro-item=""
              className="grid h-11 place-items-center rounded-full bg-brass px-4 text-[0.72rem] font-bold tracking-[0.14em] text-ink uppercase"
            >
              Book
            </Link>
            <button
              ref={menuButton}
              type="button"
              data-intro-item=""
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
              className="relative z-10 grid h-11 w-11 place-items-center"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    'absolute left-0 h-px w-6 bg-paper transition-transform duration-300',
                    open ? 'top-1.5 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 h-px w-6 bg-paper transition-transform duration-300',
                    open ? 'top-1.5 -rotate-45' : 'top-3',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-55 flex flex-col bg-ink-deep px-4 pt-24 pb-8 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col">
              {[{ href: '/', label: 'Home' }, ...NAV, { href: '/book', label: 'Book your date' }].map((item, i) => (
                <m.div
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    aria-current={location === item.href ? 'page' : undefined}
                    className="flex items-baseline gap-4 py-4 font-display text-[2.6rem] leading-none tracking-tight aria-[current=page]:text-brass"
                  >
                    <span className="font-sans text-xs text-brass">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </Link>
                </m.div>
              ))}
            </nav>
            <m.div
              className="space-y-2 pt-6 text-mist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <a className="block text-lg text-paper" href={BUSINESS.phoneHref}>
                {BUSINESS.phoneDisplay}
              </a>
              <a className="block" href={`mailto:${BUSINESS.email}`}>
                {BUSINESS.email}
              </a>
              <a className="block" href={BUSINESS.instagram} target="_blank" rel="noreferrer">
                Instagram {BUSINESS.instagramHandle}
              </a>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
