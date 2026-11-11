import { useRef, type CSSProperties } from 'react';
import { Link } from 'wouter';
import { ArrowIcon } from '../components/Brand';
import { HoverImageList, type HoverItem } from '../components/HoverImageList';
import { MagneticButton } from '../components/MagneticButton';
import { Bokeh } from '../components/motion/Bokeh';
import { RevealPhoto } from '../components/motion/RevealPhoto';
import { SplitHeading } from '../components/motion/SplitHeading';
import { VelocityMarquee } from '../components/motion/VelocityMarquee';
import { Photo } from '../components/Photo';
import type { PhotoName } from '../content/photos';
import { BUSINESS, PROCESS, SERVICES_MARQUEE } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { MEDIA } from '../lib/motion';

export function Home() {
  return (
    <>
      <Hero />
      <VelocityMarquee items={SERVICES_MARQUEE} className="border-y border-line" />
      <Statement />
      <Chapters />
      <SelectedWork />
      <WhatIPhotograph />
      <Process />
      <BookingCall />
    </>
  );
}

/* ── 1. Hero: a framed print that opens to full bleed as you scroll ─────── */

// Higgsfield ambient film goes here once Joe approves it (see README).
const HERO_FILM: { src: string } | null = null;

function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const frame = el.querySelector<HTMLElement>('[data-frame]')!;
      const media = el.querySelector<HTMLElement>('[data-media]')!;
      const copy = el.querySelector<HTMLElement>('[data-copy]')!;
      const over = el.querySelector<HTMLElement>('[data-over]')!;
      const scrim = el.querySelector<HTMLElement>('[data-scrim]')!;
      const caption = el.querySelector<HTMLElement>('[data-caption]')!;
      const cue = el.querySelector<HTMLElement>('[data-cue]');
      const mm = gsap.matchMedia();

      mm.add(MEDIA.desktop, () => {
        // start smaller and shifted so both faces sit inside the print, then settle to full frame
        gsap.set(media, { scale: 0.86, xPercent: 22, transformOrigin: '50% 50%' });
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: 'top top', end: '+=110%', pin: true, scrub: 0.8, anticipatePin: 1 },
          })
          .fromTo(
            frame,
            { clipPath: 'inset(15% 5% 13% 51% round 4px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
            0,
          )
          .to(media, { scale: 1, xPercent: 0, ease: 'none' }, 0)
          .to(cue, { opacity: 0, ease: 'none', duration: 0.15 }, 0)
          .to(copy, { yPercent: -18, opacity: 0, ease: 'none', duration: 0.5 }, 0)
          .to(caption, { opacity: 0, ease: 'none', duration: 0.2 }, 0)
          .fromTo(scrim, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.5 }, 0.45)
          .fromTo(over, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', duration: 0.45 }, 0.55);
      });

      mm.add(MEDIA.mobile, () => {
        gsap.fromTo(
          media,
          { yPercent: -4 },
          { yPercent: 6, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative flex flex-col overflow-hidden pb-6 md:block md:h-svh md:pb-0">
      <Bokeh className="z-0 opacity-90" density={1.1} />

      {/* the print */}
      <div
        data-frame=""
        data-cursor="View"
        className="relative z-10 order-2 mx-4 mt-10 aspect-[4/5] overflow-hidden rounded-[3px] md:absolute md:inset-0 md:m-0 md:aspect-auto md:rounded-none md:[clip-path:inset(15%_5%_13%_51%_round_4px)]"
      >
        <div data-print-in="" className="h-full w-full" style={{ '--d': '0.15s' } as CSSProperties}>
          <div data-media="" className="h-[108%] w-full md:h-full">
            {HERO_FILM ? (
              <video className="h-full w-full object-cover" src={HERO_FILM.src} muted loop playsInline autoPlay />
            ) : (
              <Photo
                name="friends-smiling-sofa-birthday"
                alt="Two friends laughing together on a white sofa at a birthday party"
                sizes="(min-width: 768px) 100vw, 92vw"
                priority
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover"
                imgStyle={{ objectPosition: '50% 35%' }}
              />
            )}
          </div>
        </div>
        <div data-scrim="" className="pointer-events-none absolute inset-0 bg-ink/55 opacity-0" />
        <div data-over="" className="pointer-events-none absolute inset-x-0 bottom-0 hidden opacity-0 md:block">
          <div className="wrap pb-16">
            <p className="eyebrow mb-5">The Foto Joe way</p>
            <p className="max-w-4xl font-display text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1.02] tracking-tight text-paper">
              Candid at the party.
              <br />
              <em className="text-brass-light">Editorial</em> in the portraits.
            </p>
          </div>
        </div>
      </div>
      <p
        data-caption=""
        className="relative z-10 order-3 mx-4 mt-3 text-xs text-mist md:absolute md:right-[5%] md:bottom-[calc(13%-2rem)] md:m-0"
      >
        Pictured — a birthday party
      </p>

      {/* the words */}
      <div
        data-copy=""
        className="relative z-20 order-1 pt-28 md:pointer-events-none md:absolute md:inset-0 md:flex md:flex-col md:justify-center md:pt-0"
      >
        <div className="wrap md:[&>*]:pointer-events-auto">
          <div className="max-w-[46%] max-md:max-w-none">
            <p data-rise="" style={{ '--d': '0.05s' } as CSSProperties} className="eyebrow mb-6 md:mb-8">
              Foto Joe · {BUSINESS.area}
            </p>
            <SplitHeading
              as="h1"
              id="hero-title"
              play="load"
              delay={0.15}
              className="text-[clamp(3rem,6.5vw,7rem)] leading-[0.94]"
            >
              For life’s biggest <em className="text-brass">celebrations</em>.
            </SplitHeading>
            <p data-rise="" style={{ '--d': '0.35s' } as CSSProperties} className="lede mt-6 max-w-md md:mt-8">
              Weddings, quinceañeras, milestones and portraits — photographed candidly, finished like art. {BUSINESS.years} years
              behind the camera.
            </p>
            <div data-rise="" style={{ '--d': '0.45s' } as CSSProperties} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-10">
              <MagneticButton href="/book">Check your date</MagneticButton>
              <Link href="/portfolio" className="link text-sm font-semibold tracking-[0.12em] uppercase">
                See the work <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div data-cue="" className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden="true">
        <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-mist uppercase">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-expo)_infinite] bg-brass" />
        </span>
      </div>
    </section>
  );
}

/* ── 2. Statement: calm ───────────────────────────────────────────────── */

function Statement() {
  return (
    <section aria-labelledby="statement-title" className="py-24 md:py-40">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <p className="eyebrow md:col-span-3 md:pt-4">The story</p>
        <div className="md:col-span-9">
          <SplitHeading id="statement-title" className="display-md max-w-4xl">
            I picked up a camera the day my daughter was born — and never put it down.
          </SplitHeading>
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2">
            <p className="lede">
              Thirteen years later, I photograph Chicago’s biggest celebrations the same way: looking for the real laughs, the hugs and the
              natural smiles — not the stiff, posed ones.
            </p>
            <div className="flex flex-col items-start justify-between gap-6">
              <p className="lede">For portraits, I bring a bolder eye — an edgy, editorial style that makes every image feel like a cover.</p>
              <Link href="/about" className="link link-brass text-sm font-semibold tracking-[0.12em] uppercase">
                Meet Joe <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3. Chapters: each one slides up over the last, like pages in a book ── */

type Chapter = {
  id: string;
  title: string;
  kicker: string;
  text: string;
  from: string;
  href: string;
  photo: PhotoName;
  alt: string;
  pictured: string;
  position?: string;
};

const CHAPTERS: Chapter[] = [
  {
    id: 'weddings',
    title: 'Weddings',
    kicker: 'Two photographers for the big ones',
    text: 'From the first look to the last dance — calm, candid coverage, with a second photographer built in for larger weddings and portraits worthy of your walls.',
    from: '$3,500',
    href: '/services#weddings',
    photo: 'couple-kiss-black-gold-drapes',
    alt: 'A couple sharing a kiss in front of black and gold drapes',
    pictured: 'a couple at a Sweet 16 celebration',
    position: '50% 30%',
  },
  {
    id: 'celebrations',
    title: 'Celebrations',
    kicker: 'Quinceañeras · Sweet 16s · milestones · proms',
    text: 'The entrances, the speeches, the elders on the dance floor. I cover the whole room so everyone who mattered is part of the story.',
    from: '$1,800',
    href: '/services#celebrations',
    photo: 'guest-of-honor-cream-suit-portrait',
    alt: 'The guest of honor in a cream suit and hat beside a brick wall',
    pictured: 'a milestone birthday',
    position: '50% 25%',
  },
  {
    id: 'portraits',
    title: 'Portraits & Headshots',
    kicker: 'Family · couples · maternity · seniors · executive',
    text: 'Bolder light, deeper shadows, an editorial edge. Portraits that look like magazine covers — and headshots that make the right first impression.',
    from: '$450',
    href: '/services#portraits',
    photo: 'headshot-grey-jacket-arms-crossed',
    alt: 'Professional portrait of a woman in a tailored grey jacket',
    pictured: 'an executive portrait',
    position: '50% 20%',
  },
];

function Chapters() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', ref.current);
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        panels.forEach((panel, i) => {
          const next = panels[i + 1];
          if (!next) return;
          gsap
            .timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: 0.6 } })
            .to(panel.querySelector('[data-sheet]'), { scale: 0.92, ease: 'none' }, 0)
            .to(panel.querySelector('[data-dim]'), { opacity: 0.7, ease: 'none' }, 0);
        });
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelector('[data-pimg]'),
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="What I photograph" className="relative">
      {CHAPTERS.map((c, i) => (
        <article
          key={c.id}
          id={c.id}
          data-panel=""
          aria-labelledby={`${c.id}-title`}
          className="relative md:sticky md:top-0 md:h-svh"
          style={{ zIndex: i + 1 }}
        >
          <div data-sheet="" className="relative h-full origin-top overflow-hidden border-t border-line bg-ink">
            <div className={`grid h-full md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <Link href={c.href} data-cursor="Explore" className="relative block aspect-[4/5] overflow-hidden md:aspect-auto md:h-full">
                <div data-pimg="" className="absolute inset-x-0 -top-[7%] h-[114%]">
                  <Photo
                    name={c.photo}
                    alt={c.alt}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                    imgStyle={{ objectPosition: c.position }}
                  />
                </div>
                <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1.5 text-[0.7rem] text-paper/85 backdrop-blur-sm">
                  Pictured — {c.pictured}
                </span>
              </Link>
              <div className="flex flex-col justify-between gap-10 px-4 py-14 md:px-14 md:py-20 lg:px-20">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-6xl leading-none text-transparent italic [-webkit-text-stroke:1px_var(--color-brass)] md:text-8xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="eyebrow">Chapter {i + 1} of 3</span>
                </div>
                <div>
                  <p className="eyebrow mb-5 text-mist">{c.kicker}</p>
                  <h2 id={`${c.id}-title`} className="display-lg">
                    {c.title}
                  </h2>
                  <p className="lede mt-6 max-w-lg">{c.text}</p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                  <p>
                    <span className="block text-xs font-semibold tracking-[0.2em] text-mist uppercase">Collections begin at</span>
                    <span className="font-display text-5xl leading-none text-brass md:text-6xl">{c.from}</span>
                  </p>
                  <Link href={c.href} className="link text-sm font-semibold tracking-[0.12em] uppercase">
                    See collections <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
            <div data-dim="" className="pointer-events-none absolute inset-0 bg-ink-deep opacity-0" />
          </div>
        </article>
      ))}
    </section>
  );
}

/* ── 4. Selected work: calm, editorial ─────────────────────────────────── */

const WORK: Array<{ name: PhotoName; alt: string; caption: string; className: string; aspect: string; sizes: string }> = [
  {
    name: 'couple-embrace-birthday-party',
    alt: 'A couple embracing and smiling at a party',
    caption: 'Birthday party · 2026',
    className: 'md:col-span-7',
    aspect: 'aspect-[3/2]',
    sizes: '(min-width: 768px) 58vw, 100vw',
  },
  {
    name: 'couple-black-sequin-wall-gold-balloons',
    alt: 'A couple posing in front of a black sequin wall and gold balloons',
    caption: '45th birthday · 2026',
    className: 'md:col-span-4 md:col-start-9 md:mt-32',
    aspect: 'aspect-[2/3]',
    sizes: '(min-width: 768px) 33vw, 100vw',
  },
  {
    name: 'elders-leather-sofa-family-birthday',
    alt: 'An elderly couple sitting close together on a leather sofa',
    caption: 'Family birthday · 2025',
    className: 'md:col-span-5 md:col-start-2 md:-mt-16',
    aspect: 'aspect-[3/2]',
    sizes: '(min-width: 768px) 42vw, 100vw',
  },
  {
    name: 'gentlemen-tuxedos-banquet',
    alt: 'Two men in tuxedos smiling at a banquet',
    caption: 'Banquet · 2017',
    className: 'md:col-span-5 md:col-start-8 md:mt-24',
    aspect: 'aspect-[3/2]',
    sizes: '(min-width: 768px) 42vw, 100vw',
  },
  {
    name: 'headshot-grey-jacket-smile',
    alt: 'Smiling portrait of a woman in a grey jacket by a window',
    caption: 'Executive portrait · 2025',
    className: 'md:col-span-4 md:col-start-3 md:-mt-8',
    aspect: 'aspect-[2/3]',
    sizes: '(min-width: 768px) 33vw, 100vw',
  },
  {
    name: 'banquet-hall-black-gold-tables',
    alt: 'Banquet hall dressed in black and gold with balloon centerpieces',
    caption: 'Sweet 16 venue · 2025',
    className: 'md:col-span-5 md:col-start-8 md:mt-40',
    aspect: 'aspect-[3/2]',
    sizes: '(min-width: 768px) 42vw, 100vw',
  },
];

function SelectedWork() {
  return (
    <section aria-labelledby="work-title" className="relative z-10 bg-ink py-24 md:py-40">
      <div className="wrap">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6">Selected work</p>
            <SplitHeading id="work-title" className="display-lg max-w-3xl">
              Real people. Real joy. <em className="text-brass-light">Framed like art.</em>
            </SplitHeading>
          </div>
          <MagneticButton href="/portfolio">Full portfolio</MagneticButton>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-0">
          {WORK.map((w) => (
            <figure key={w.name} className={w.className}>
              <Link href="/portfolio" aria-label={`${w.alt} — open the portfolio`} className="block">
                <RevealPhoto name={w.name} alt={w.alt} sizes={w.sizes} cursorLabel="View" className={`crop-marks ${w.aspect}`} />
              </Link>
              <figcaption className="mt-3 flex justify-between text-xs tracking-wide text-mist">
                <span>{w.caption}</span>
                <span className="text-brass">Foto Joe</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5. What I photograph: hover a row to preview ──────────────────────── */

const SERVICE_ROWS: HoverItem[] = [
  { id: 'weddings', title: 'Weddings', meta: 'from $3,500', href: '/services#weddings', image: 'reception-room-hero', alt: '' },
  { id: 'quince', title: 'Quinceañeras', meta: 'from $2,800', href: '/services#celebrations', image: 'banquet-hall-black-gold-tables', alt: '' },
  { id: 'milestones', title: 'Sweet 16s & milestones', meta: 'from $1,800', href: '/services#celebrations', image: 'birthday-cakes-carried-in', alt: '' },
  { id: 'proms', title: 'Proms & send-offs', meta: 'from $1,800', href: '/services#celebrations', image: 'gentlemen-tuxedos-banquet', alt: '' },
  { id: 'corporate', title: 'Galas & corporate', meta: 'from $400 / hr', href: '/services#celebrations', image: 'gentlemen-suits-banquet', alt: '' },
  { id: 'family', title: 'Showers, reunions & church', meta: 'Let’s talk', href: '/book', image: 'family-christmas-tree-gathering', alt: '' },
  { id: 'portraits', title: 'Portraits & headshots', meta: 'from $450', href: '/services#portraits', image: 'headshot-grey-jacket-close', alt: '' },
];

function WhatIPhotograph() {
  return (
    <section aria-labelledby="services-title" className="relative z-10 bg-ink pb-24 md:pb-40">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-6">What I photograph</p>
          <SplitHeading id="services-title" className="display-md">
            If it matters to your family, it matters to me.
          </SplitHeading>
          <p className="lede mt-6 max-w-sm">
            {BUSINESS.area}. {BUSINESS.travel} — tell me where.
          </p>
        </div>
        <HoverImageList items={SERVICE_ROWS} className="md:col-span-8" />
      </div>
    </section>
  );
}

/* ── 6. How it works ───────────────────────────────────────────────────── */

function Process() {
  return (
    <section aria-labelledby="process-title" className="relative z-10 border-t border-line bg-ink-deep py-24 md:py-36">
      <div className="wrap">
        <p className="eyebrow mb-6">How it works</p>
        <SplitHeading id="process-title" className="display-md max-w-3xl">
          Easy from the first message to the final gallery.
        </SplitHeading>
        <ol className="mt-16 grid gap-px overflow-hidden border-y border-line md:mt-20 md:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="group relative py-10 md:px-8 md:py-14 md:first:pl-0">
              <span className="font-display text-5xl text-brass italic transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-display text-2xl leading-tight md:text-[1.7rem]">{step.title}</h3>
              <p className="mt-4 max-w-xs text-mist">{step.text}</p>
              {i < PROCESS.length - 1 ? <span className="absolute top-10 right-0 hidden h-[calc(100%-5rem)] w-px bg-line md:block" /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── 7. Booking: calm, glowing ─────────────────────────────────────────── */

export function BookingCall() {
  return (
    <section aria-labelledby="book-title" className="relative z-10 overflow-hidden bg-ink py-28 md:py-44">
      <Bokeh density={1.3} intensity={1.15} />
      <div className="wrap relative">
        <p className="eyebrow mb-6">Your date</p>
        <SplitHeading id="book-title" className="display-xl max-w-5xl">
          Your day only <em className="text-brass">happens once</em>.
        </SplitHeading>
        <p className="lede mt-8 max-w-xl">Tell me about your celebration — where, when, and who matters most. {BUSINESS.replyPromise}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
          <MagneticButton href="/book">Check your date</MagneticButton>
          <a href={BUSINESS.phoneHref} className="link text-lg">
            or call / text {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
