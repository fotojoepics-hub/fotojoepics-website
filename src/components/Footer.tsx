import { Link } from 'wouter';
import { BUSINESS, NAV } from '../content/site';
import { CameraIcon, Signature } from './Brand';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-ink-deep pt-20 pb-10 md:pt-28">
      <div className="wrap">
        <div className="flex flex-col gap-14 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-end gap-3 text-paper">
              <Signature className="h-24 w-auto md:h-32" title="Foto Joe" />
              <CameraIcon className="mb-4 w-9 text-brass md:mb-5 md:w-11" />
            </div>
            <p className="mt-4 text-[0.72rem] font-semibold tracking-[0.36em] text-mist uppercase">J.L. Robinson Imaging</p>
          </div>
          <p className="max-w-sm font-display text-2xl leading-snug text-paper/90 md:text-right md:text-3xl">
            Celebrations and portraits for {BUSINESS.area}. {BUSINESS.travel}.
          </p>
        </div>

        <hr className="rule my-12 md:my-16" />

        <div className="grid gap-10 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="eyebrow mb-4">Contact</p>
            <ul className="space-y-2">
              <li>
                <a className="link" href={BUSINESS.phoneHref}>
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="link" href={`mailto:${BUSINESS.email}`}>
                  {BUSINESS.email}
                </a>
              </li>
              <li className="text-mist">{BUSINESS.replyPromise}</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-2">
              {[{ href: '/', label: 'Home' }, ...NAV, { href: '/book', label: 'Book your date' }].map((item) => (
                <li key={item.href}>
                  <Link className="link" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Serving</p>
            <ul className="space-y-2 text-mist">
              <li>Chicago</li>
              <li>The South Suburbs</li>
              <li>Further afield — ask about travel</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Follow</p>
            <a className="link" href={BUSINESS.instagram} target="_blank" rel="noreferrer">
              Instagram {BUSINESS.instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 text-xs text-mist sm:flex-row sm:justify-between">
          <p>
            © {year} {BUSINESS.owner} · {BUSINESS.legalName}
          </p>
          <p>Every photograph on this site was made by Joe.</p>
        </div>
      </div>
    </footer>
  );
}
