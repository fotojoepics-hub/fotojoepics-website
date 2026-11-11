import { useRef } from 'react';
import { MagneticButton } from '../components/MagneticButton';
import { PageHeader } from '../components/PageHeader';
import { RevealPhoto } from '../components/motion/RevealPhoto';
import { SplitHeading } from '../components/motion/SplitHeading';
import type { PhotoName } from '../content/photos';
import { BUSINESS, CELEBRATIONS, PORTRAITS, WEDDINGS, type Collection } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { cn, MEDIA } from '../lib/motion';
import { BookingCall } from './Home';

export function Services() {
  return (
    <>
      <PageHeader eyebrow="Collections & pricing" id="services-title" title={<>An investment in <em className="text-brass">forever</em>.</>}>
        Every collection is shaped around your day. The prices below are where collections begin — after we talk, I’ll send a quote built
        for your guest count, venue and timeline.
      </PageHeader>

      <Group
        id="weddings"
        index="01"
        title="Weddings"
        intro="Calm, candid coverage of the whole day, with portraits you’ll want on the wall. For larger weddings a second photographer is built in, so nothing — and no one — is missed."
        photo="couple-kiss-black-gold-drapes"
        alt="A couple sharing a kiss in front of black and gold drapes"
        pictured="a couple at a Sweet 16 celebration"
        items={WEDDINGS}
      />
      <Group
        id="celebrations"
        index="02"
        title="Celebrations"
        intro="Quinceañeras, Sweet 16s, milestone birthdays, proms, galas and corporate nights. I cover the room — the entrances, the speeches, the dance floor and the quiet moments in between."
        photo="birthday-cakes-carried-in"
        alt="Two birthday cakes being carried into a party"
        pictured="a birthday celebration"
        items={CELEBRATIONS}
      />
      <Group
        id="portraits"
        index="03"
        title="Portraits & Headshots"
        intro="Family, couples, maternity and senior portraits with an editorial edge — plus executive headshots and personal branding that make the right first impression."
        photo="headshot-grey-jacket-arms-crossed"
        alt="Professional portrait of a woman in a tailored grey jacket"
        pictured="an executive portrait"
        items={PORTRAITS}
      />

      <section aria-labelledby="details-title" className="border-t border-line py-24 md:py-32">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow mb-6">Good to know</p>
            <SplitHeading id="details-title" className="display-md">
              The details.
            </SplitHeading>
          </div>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 md:col-span-8">
            {[
              ['Second photographer', 'Built into larger weddings and any celebration over about 150 guests, so both sides of the room are covered.'],
              ['Travel', `Based in ${BUSINESS.area}. ${BUSINESS.travel} — destination quotes include travel and accommodations.`],
              ['Reserving your date', 'A signed agreement and a retainer hold your date. Dates are reserved first come, first served.'],
              ['Albums & wall art', 'Heirloom albums and prints are included in some collections and can be added to any of them.'],
            ].map(([term, detail]) => (
              <div key={term} className="border-t border-line pt-6">
                <dt className="font-display text-2xl">{term}</dt>
                <dd className="mt-3 text-mist">{detail}</dd>
              </div>
            ))}
            {/* TODO(Joe): retainer percentage, gallery turnaround time, add-on prices (extra hour, second photographer, rush delivery, albums). */}
          </dl>
        </div>
      </section>

      <BookingCall />
    </>
  );
}

type GroupProps = {
  id: string;
  index: string;
  title: string;
  intro: string;
  photo: PhotoName;
  alt: string;
  pictured: string;
  items: Collection[];
};

function Group({ id, index, title, intro, photo, alt, pictured, items }: GroupProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from(gsap.utils.toArray<HTMLElement>('[data-col]', ref.current), {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current!.querySelector('[data-cols]'), start: 'top 85%', once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-line py-20 md:py-32">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <p className="eyebrow mb-6">
              {index} · Collections
            </p>
            <SplitHeading id={`${id}-heading`} className="display-lg">
              {title}
            </SplitHeading>
            <p className="lede mt-6 max-w-md">{intro}</p>
          </div>
          <figure className="md:col-span-5 md:col-start-8">
            <RevealPhoto name={photo} alt={alt} sizes="(min-width: 768px) 36vw, 100vw" className="crop-marks aspect-[4/3]" />
            <figcaption className="mt-3 text-xs text-mist">Pictured — {pictured}</figcaption>
          </figure>
        </div>

        <div data-cols="" className={cn('mt-16 grid gap-px border-t border-line md:mt-24', items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
          {items.map((c) => (
            <article
              key={c.name}
              data-col=""
              className={cn(
                'group relative flex flex-col gap-6 border-b border-line py-10 md:border-b-0 md:px-8 md:first:pl-0 md:[&:not(:last-child)]:border-r',
                c.featured && 'before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-brass md:before:left-8 md:first:before:left-0',
              )}
            >
              <div>
                <h3 className="font-display text-3xl md:text-4xl">{c.name}</h3>
                <p className="mt-2 text-mist">{c.summary}</p>
              </div>
              <p className="flex items-baseline gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-mist uppercase">From</span>
                <span className="font-display text-5xl leading-none text-brass transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-1 md:text-6xl">
                  {c.from}
                </span>
                {c.unit ? <span className="text-sm text-mist">{c.unit}</span> : null}
              </p>
              <ul className="space-y-3 text-paper/90">
                {c.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-brass" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4">
                <MagneticButton href="/book" size="sm">
                  Check your date
                </MagneticButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
