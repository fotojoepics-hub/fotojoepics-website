import { CameraIcon, Signature } from '../components/Brand';
import { PageHeader } from '../components/PageHeader';
import { RevealPhoto } from '../components/motion/RevealPhoto';
import { SplitHeading } from '../components/motion/SplitHeading';
import { BUSINESS } from '../content/site';
import { BookingCall } from './Home';

const BELIEFS = [
  {
    title: 'Real over posed',
    text: 'Family events give me the natural smiles — the ones that happen when nobody is told to say cheese. I stay quiet and let them happen.',
    photo: 'elders-leather-sofa-family-birthday' as const,
    alt: 'An elderly couple sitting close together on a leather sofa',
  },
  {
    title: 'An edgy eye',
    text: 'Portraits get bolder light, deeper shadows and an editorial finish, so they feel like a magazine cover instead of a school photo.',
    photo: 'couple-black-sequin-wall-gold-balloons' as const,
    alt: 'A couple posing in front of a black sequin wall and gold balloons',
  },
  {
    title: 'Serious equipment',
    text: 'Your day only happens once, so I invest in professional-grade gear that delivers sharp, rich images in any light.',
    photo: 'reception-room-hero' as const,
    alt: 'A candle-lit reception room with gold chairs',
  },
];

export function About() {
  return (
    <>
      <PageHeader eyebrow="About Joe" id="about-title" title={<>It started with my <em className="text-brass">daughter</em>.</>} />

      <section aria-label="Joe's story" className="pb-24 md:pb-36">
        <div className="wrap grid gap-14 md:grid-cols-12">
          <figure className="md:col-span-5">
            {/* TODO(Joe): add a portrait of Joe, ideally with his camera. */}
            <div className="crop-marks grid aspect-[4/5] place-items-center border border-dashed border-line-strong bg-ink-raised">
              <div className="text-center">
                <CameraIcon className="mx-auto w-12 text-brass" strokeWidth={2} />
                <p className="mt-4 text-xs font-semibold tracking-[0.24em] text-mist uppercase">Portrait of Joe — coming soon</p>
              </div>
            </div>
            <figcaption className="mt-3 text-xs text-mist">
              {BUSINESS.owner} · {BUSINESS.area}
            </figcaption>
          </figure>

          <div className="md:col-span-6 md:col-start-7">
            <div className="space-y-6 text-lg leading-relaxed text-paper/90 md:text-xl">
              <p>
                When my firstborn arrived, I picked up a camera to hold onto every moment — and I never put it down. What began as a
                father’s habit became my life’s work.
              </p>
              <p>
                Today I photograph celebrations across {BUSINESS.area}, and family is still at the heart of everything I shoot. My
                favorite pictures aren’t the stiff, posed ones. They’re the real laughs, the hugs, the moment the guest of honor sees the
                cake. I work quietly through your event so people forget the camera is there — and that’s when the natural smiles come
                out.
              </p>
              <p>For portraits, I bring a bolder eye: an edgy, editorial style of shooting and editing that makes every image feel like a magazine cover.</p>
              <p>And because your day only happens once, I invest in professional-grade equipment, so every photo is sharp, rich and built to last.</p>
            </div>
            <div className="mt-12 flex items-end gap-3 text-brass">
              <Signature className="h-20 w-auto" title="Foto Joe" />
            </div>
            <p className="mt-2 text-sm text-mist">{BUSINESS.owner}</p>

            <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-10">
              <div>
                <dt className="text-xs font-semibold tracking-[0.2em] text-mist uppercase">Behind the camera</dt>
                <dd className="mt-2 font-display text-5xl text-brass">{BUSINESS.years} years</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.2em] text-mist uppercase">Based in</dt>
                <dd className="mt-2 font-display text-2xl leading-tight">
                  Chicago &amp; the
                  <br />
                  South Suburbs
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="beliefs-title" className="border-t border-line py-24 md:py-36">
        <div className="wrap">
          <p className="eyebrow mb-6">What I believe</p>
          <SplitHeading id="beliefs-title" className="display-lg max-w-3xl">
            Three things you can count on.
          </SplitHeading>
          <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-8">
            {BELIEFS.map((b, i) => (
              <article key={b.title} className={i === 1 ? 'md:mt-20' : undefined}>
                <RevealPhoto name={b.photo} alt={b.alt} sizes="(min-width: 768px) 31vw, 100vw" className="aspect-[4/5]" />
                <p className="mt-6 font-display text-sm text-brass italic">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-display text-3xl">{b.title}</h3>
                <p className="mt-3 text-mist">{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BookingCall />
    </>
  );
}
