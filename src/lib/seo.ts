import { BUSINESS } from '../content/site';

type Meta = { title: string; description: string };

export const ROUTE_META: Record<string, Meta> = {
  '/': {
    title: 'Foto Joe | Celebration & Portrait Photographer · Chicago & South Suburbs',
    description:
      'Weddings, quinceañeras, milestone birthdays, proms and portraits across Chicago and the South Suburbs. Candid, timeless photography by Joe Robinson — 13 years behind the camera.',
  },
  '/portfolio': {
    title: 'Portfolio | Foto Joe Photography',
    description: 'Celebrations, couples, portraits and the rooms they happened in — selected work by Chicago photographer Joe Robinson.',
  },
  '/services': {
    title: 'Collections & Pricing | Foto Joe Photography',
    description:
      'Wedding collections from $3,500, quinceañeras from $2,800, milestone celebrations from $1,800 and portraits from $450. Chicago & the South Suburbs.',
  },
  '/about': {
    title: 'About Joe Robinson | Foto Joe Photography',
    description: 'It started with his daughter. Thirteen years later, Joe photographs Chicago’s biggest celebrations — candid at events, edgy in portraits.',
  },
  '/book': {
    title: 'Book Your Date | Foto Joe Photography',
    description: `Check availability for your wedding, quinceañera, celebration or portrait session. ${BUSINESS.replyPromise}`,
  },
  '/404': {
    title: 'Page not found | Foto Joe Photography',
    description: 'This frame is empty. Head back to the portfolio or book your date.',
  },
};

export function metaFor(path: string): Meta {
  return ROUTE_META[path] ?? ROUTE_META['/404'];
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// TODO(Joe): once fotojoepics.com is connected, add canonical + absolute og:url tags.
export function headTags(path: string): string {
  const m = metaFor(path);
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Foto Joe — J.L. Robinson Imaging" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="/og.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (path === '/404') tags.push('<meta name="robots" content="noindex" />');
  if (path === '/') {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Foto Joe — J.L. Robinson Imaging',
      description: ROUTE_META['/'].description,
      founder: { '@type': 'Person', name: BUSINESS.owner },
      telephone: '+1-708-612-0549',
      email: BUSINESS.email,
      areaServed: ['Chicago, IL', 'Chicago South Suburbs, IL'],
      sameAs: [BUSINESS.instagram],
      image: '/og.jpg',
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}
