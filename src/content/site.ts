// Everything a visitor reads about the business lives here, so Joe's details
// stay identical across every page. Only facts Joe has confirmed go in.

export const BUSINESS = {
  name: 'Foto Joe',
  legalName: 'J.L. Robinson Imaging',
  owner: 'Joe L. Robinson Jr.',
  phoneDisplay: '(708) 612-0549',
  phoneHref: 'tel:+17086120549',
  smsHref: 'sms:+17086120549',
  email: 'fotojoepics@gmail.com',
  instagram: 'https://www.instagram.com/fotojoerobinson/',
  instagramHandle: '@fotojoerobinson',
  area: 'Chicago & the South Suburbs',
  areaShort: 'Chicago · South Suburbs',
  travel: 'Available for travel',
  years: 13,
  replyPromise: 'I reply within 24 hours.',
} as const;

export const NAV = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
] as const;

/** Services Joe confirmed he offers. Used for the marquee and the booking form. */
export const SERVICES_MARQUEE = [
  'Weddings',
  'Quinceañeras',
  'Sweet 16s',
  'Milestone Birthdays',
  'Proms & Send-Offs',
  'Galas',
  'Corporate Events',
  'Baby Showers',
  'Graduations',
  'Family Reunions',
  'Church Events',
  'Portraits',
  'Headshots',
] as const;

export const EVENT_TYPES = [
  'Wedding',
  'Quinceañera',
  'Sweet 16',
  'Milestone birthday',
  'Prom or send-off',
  'Gala or banquet',
  'Corporate event',
  'Baby shower',
  'Graduation',
  'Family reunion',
  'Church event',
  'Portrait session (family, couples, maternity, seniors)',
  'Headshots or brand photos',
  'Something else',
] as const;

export const BUDGETS = [
  'Under $2,000',
  '$2,000 – $3,500',
  '$3,500 – $5,500',
  '$5,500 – $7,500',
  '$7,500+',
  'Not sure yet',
] as const;

export type Collection = {
  name: string;
  from: string;
  unit?: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

// Prices agreed with Joe (premium positioning, Nov 2026). "From" = starting price.
export const WEDDINGS: Collection[] = [
  {
    name: 'Intimate',
    from: '$3,500',
    summary: 'Up to about 75 guests.',
    includes: ['6 hours of coverage', 'One photographer', 'Second photographer available'],
  },
  {
    name: 'Signature',
    from: '$5,500',
    summary: 'Up to about 200 guests.',
    includes: ['8 hours of coverage', 'Two photographers', 'Engagement session'],
    featured: true,
  },
  {
    name: 'Grand',
    from: '$7,500',
    summary: '200 guests and beyond.',
    includes: ['10 hours of coverage', 'Two photographers plus an assistant', 'Engagement session', 'Heirloom album'],
  },
];

export const CELEBRATIONS: Collection[] = [
  {
    name: 'Quinceañera Collection',
    from: '$2,800',
    summary: 'Her day, from the dress to the last dance.',
    includes: ['Portrait session in the dress before the day', 'Full-day coverage', 'Album'],
    featured: true,
  },
  {
    name: 'Milestone Celebrations',
    from: '$1,800',
    summary: 'Sweet 16s, milestone birthdays, proms and galas.',
    includes: ['4-hour minimum', 'Second photographer included for 150+ guests'],
  },
  {
    name: 'Corporate Events',
    from: '$400',
    unit: 'per hour',
    summary: 'Banquets, launches, award nights and conferences.',
    includes: ['3-hour minimum'],
  },
];

export const PORTRAITS: Collection[] = [
  {
    name: 'Portrait Session',
    from: '$450',
    summary: 'Family, couples, maternity and seniors, with an editorial edge.',
    includes: ['Styled for you', 'Studio or on location'],
  },
  {
    name: 'Executive & Brand',
    from: '$750',
    summary: 'Headshots and personal branding for leaders and creatives.',
    includes: ['Polished, magazine-style retouching'],
  },
];

export const PROCESS = [
  {
    title: 'Tell me about your day',
    text: 'Send a few details through the booking page. I reply within 24 hours with availability.',
  },
  {
    title: 'We plan it together',
    text: 'A call or coffee to talk timeline, people who matter, and the moments you can’t miss.',
  },
  {
    title: 'I disappear into the room',
    text: 'Quiet, calm coverage that catches the real laughs, hugs and tears — plus the portraits you’ll frame.',
  },
  {
    title: 'Your gallery arrives',
    text: 'Edited with care and delivered to share, download and print. Albums and wall art available.',
  },
] as const;
