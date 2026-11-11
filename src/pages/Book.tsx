import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { scrollToTarget, useLenis } from '../lib/smooth-scroll';
import { ArrowIcon } from '../components/Brand';
import { PageHeader } from '../components/PageHeader';
import { BUDGETS, BUSINESS, EVENT_TYPES } from '../content/site';

type Fields = {
  name: string;
  contact: string;
  type: string;
  date: string;
  guests: string;
  venue: string;
  budget: string;
  message: string;
};
const EMPTY: Fields = { name: '', contact: '', type: '', date: '', guests: '', venue: '', budget: '', message: '' };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Please add your name.';
  const c = f.contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
  const isPhone = c.replace(/\D/g, '').length >= 10;
  if (!c) e.contact = 'Add an email or phone number so I can reply.';
  else if (!isEmail && !isPhone) e.contact = 'That doesn’t look like an email or a phone number.';
  if (!f.type) e.type = 'Choose what you’re planning.';
  return e;
}

function summary(f: Fields) {
  return [
    `Name: ${f.name}`,
    `Email / phone: ${f.contact}`,
    `Planning: ${f.type}`,
    `Date: ${f.date || 'Not set yet'}`,
    `Guests: ${f.guests || '—'}`,
    `Venue / location: ${f.venue || '—'}`,
    `Budget: ${f.budget || '—'}`,
    '',
    f.message || '',
  ].join('\n');
}

export function Book() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useEffect(() => {
    if (sent && topRef.current) scrollToTarget(lenis, topRef.current);
  }, [sent, lenis]);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  // TODO(Joe): deliver inquiries straight to email with a Cloudflare Worker + Turnstile spam check.
  // Until then the form opens the visitor's email app with everything filled in, addressed to Joe.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    const firstBad = Object.keys(errs)[0];
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    const subject = `Booking inquiry — ${fields.type}${fields.date ? ` on ${fields.date}` : ''}`;
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary(fields))}`;
    setSent(true);
  };

  const field = (k: keyof Fields) => ({
    id: `f-${k}`,
    name: k,
    value: fields[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `f-${k}-err` : undefined,
  });
  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`f-${k}-err`} className="field-error">
        {errors[k]}
      </p>
    ) : null;

  return (
    <>
      <PageHeader eyebrow="Book your date" id="book-page-title" title={<>Let’s talk about your <em className="text-brass">day</em>.</>}>
        A few details are all I need to check availability. {BUSINESS.replyPromise}
      </PageHeader>

      <section aria-labelledby="book-page-title" className="pb-24 md:pb-36">
        <div className="wrap grid gap-16 md:grid-cols-12">
          <div ref={topRef} className="md:col-span-7">
            <AnimatePresence mode="wait">
              {sent ? (
                <m.div
                  key="thanks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-brass pt-10"
                  role="status"
                >
                  <p className="eyebrow mb-4">Thank you, {fields.name.split(' ')[0]}</p>
                  <h2 className="display-md">Your email is ready to send.</h2>
                  <p className="lede mt-6 max-w-lg">
                    Your email app should have opened with everything filled in and addressed to me — just press send. If it didn’t open,
                    call or text <a className="link text-paper" href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a> or email{' '}
                    <a className="link text-paper" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
                  </p>
                  <button type="button" className="link link-brass mt-8 text-sm font-semibold tracking-[0.12em] uppercase" onClick={() => setSent(false)}>
                    Edit my details
                  </button>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid gap-x-8 gap-y-9 sm:grid-cols-2"
                  aria-describedby="form-note"
                >
                  <div className="field">
                    <label htmlFor="f-name">Your name</label>
                    <input {...field('name')} autoComplete="name" placeholder="First and last name" />
                    {err('name')}
                  </div>
                  <div className="field">
                    <label htmlFor="f-contact">Email or phone</label>
                    <input {...field('contact')} autoComplete="email" inputMode="email" placeholder="So I can reply" />
                    {err('contact')}
                  </div>
                  <div className="field">
                    <label htmlFor="f-type">What are you planning?</label>
                    <select {...field('type')}>
                      <option value="">Choose one</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    {err('type')}
                  </div>
                  <div className="field">
                    <label htmlFor="f-date">Event date</label>
                    <input {...field('date')} type="date" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-guests">Guest count</label>
                    <input {...field('guests')} inputMode="numeric" placeholder="About how many?" />
                  </div>
                  <div className="field">
                    <label htmlFor="f-venue">Venue or location</label>
                    <input {...field('venue')} placeholder="Venue, city or ‘not booked yet’" />
                  </div>
                  <div className="field sm:col-span-2">
                    <label htmlFor="f-budget">Photography budget</label>
                    <select {...field('budget')}>
                      <option value="">Choose a range (optional)</option>
                      {BUDGETS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field sm:col-span-2">
                    <label htmlFor="f-message">Tell me about it</label>
                    <textarea {...field('message')} rows={4} placeholder="The vibe, the people who matter most, anything I should know" />
                  </div>
                  <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p id="form-note" className="max-w-sm text-sm text-mist">
                      Sending opens your email app with your details filled in, addressed to {BUSINESS.email}.
                    </p>
                    <button type="submit" className="btn self-start">
                      <span className="btn-label">
                        <span>Send inquiry</span>
                        <span aria-hidden="true">Send inquiry</span>
                      </span>
                      <span className="btn-dot" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </button>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>

          <aside className="md:col-span-4 md:col-start-9" aria-label="Other ways to reach Joe">
            <div className="space-y-10 border-t border-line pt-8">
              <div>
                <p className="eyebrow mb-3">Call or text</p>
                <a href={BUSINESS.phoneHref} className="link font-display text-3xl">
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-3">Email</p>
                <a href={`mailto:${BUSINESS.email}`} className="link text-lg break-all">
                  {BUSINESS.email}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-3">Instagram</p>
                <a href={BUSINESS.instagram} target="_blank" rel="noreferrer" className="link text-lg">
                  {BUSINESS.instagramHandle}
                </a>
              </div>
              <div className="border-t border-line pt-8 text-mist">
                <p className="mb-2 font-display text-xl text-paper">Where I work</p>
                <p>
                  {BUSINESS.area}. {BUSINESS.travel} — quotes for destination events include travel and accommodations.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
