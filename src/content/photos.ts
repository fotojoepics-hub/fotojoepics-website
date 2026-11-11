import data from './photos.gen.json';

export type PhotoName = keyof typeof data;
export type PhotoMeta = { w: number; h: number; widths: number[]; color: string };
export const PHOTOS = data as Record<PhotoName, PhotoMeta>;

export type Category = 'celebrations' | 'portraits' | 'couples' | 'details';

export type PortfolioItem = {
  name: PhotoName;
  alt: string;
  /** What the photo actually shows — never a client's name. */
  caption: string;
  category: Category;
};

export const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all: 'All work',
  celebrations: 'Celebrations',
  portraits: 'Portraits',
  couples: 'Couples',
  details: 'Rooms & details',
};

// TODO(Joe): this is a placeholder selection from Joe's work. Replace with his curated
// portfolio, and confirm every featured client is happy to be shown.
export const PORTFOLIO: PortfolioItem[] = [
  { name: 'couple-kiss-black-gold-drapes', alt: 'A couple sharing a kiss in front of black and gold drapes', caption: 'Sweet 16 celebration · 2025', category: 'couples' },
  { name: 'friends-smiling-sofa-birthday', alt: 'Two friends laughing together on a white sofa at a birthday party', caption: 'Birthday party · 2026', category: 'celebrations' },
  { name: 'headshot-grey-jacket-arms-crossed', alt: 'Professional headshot of a woman in a tailored grey jacket, arms crossed', caption: 'Executive portrait · 2025', category: 'portraits' },
  { name: 'guest-of-honor-cream-suit-portrait', alt: 'The guest of honor in a cream suit and hat beside a brick wall', caption: 'Milestone birthday · 2025', category: 'portraits' },
  { name: 'reception-room-hero', alt: 'Reception room set with gold chairs, black linens and candelabras', caption: '45th birthday reception · 2026', category: 'details' },
  { name: 'couple-black-sequin-wall-gold-balloons', alt: 'A couple posing in front of a black sequin wall and gold balloons', caption: '45th birthday · 2026', category: 'couples' },
  { name: 'elders-leather-sofa-family-birthday', alt: 'An elderly couple sitting close together on a leather sofa', caption: 'Family birthday · 2025', category: 'celebrations' },
  { name: 'gentlemen-tuxedos-banquet', alt: 'Two men in tuxedos smiling at a banquet', caption: 'Banquet · 2017', category: 'celebrations' },
  { name: 'birthday-cakes-carried-in', alt: 'Two birthday cakes being carried into the party', caption: 'Birthday celebration · 2025', category: 'celebrations' },
  { name: 'headshot-grey-jacket-smile', alt: 'Smiling headshot of a woman in a grey jacket by a window', caption: 'Executive portrait · 2025', category: 'portraits' },
  { name: 'banquet-couple-royal-blue', alt: 'A couple in royal blue at a banquet, balloons behind them', caption: 'Banquet · 2017', category: 'couples' },
  { name: 'friends-white-green-suits-birthday', alt: 'Two women in white and green suits posing at a birthday party', caption: 'Birthday party · 2026', category: 'celebrations' },
  { name: 'banquet-hall-black-gold-tables', alt: 'Banquet hall dressed in black and gold with balloon centerpieces', caption: 'Sweet 16 venue · 2025', category: 'details' },
  { name: 'dance-floor-birthday-celebration', alt: 'Guests dancing on a wooden dance floor', caption: 'Birthday celebration · 2025', category: 'celebrations' },
  { name: 'portrait-pink-boa-painted-backdrop', alt: 'A woman in a zebra outfit and pink boa posing before a painted backdrop', caption: 'Costume banquet · 2017', category: 'portraits' },
  { name: 'couple-embrace-birthday-party', alt: 'A couple embracing and smiling at a party', caption: 'Birthday party · 2026', category: 'couples' },
  { name: 'grandfather-birthday-cake-table', alt: 'A grandfather at the head of the table beside his birthday cake', caption: 'Family birthday · 2025', category: 'celebrations' },
  { name: 'headshot-grey-jacket-close', alt: 'Close portrait of a woman in a grey jacket', caption: 'Executive portrait · 2025', category: 'portraits' },
  { name: 'gentlemen-suits-banquet', alt: 'Two gentlemen in suits and hats sharing a laugh at a banquet', caption: 'Banquet · 2017', category: 'celebrations' },
  { name: 'family-christmas-tree-gathering', alt: 'A family gathered around a red and gold Christmas tree', caption: 'Holiday gathering · 2025', category: 'celebrations' },
  { name: 'friends-denim-jacket-birthday', alt: 'Two friends posing together, one in a patched denim jacket', caption: 'Birthday party · 2026', category: 'celebrations' },
  { name: 'guest-of-honor-head-table', alt: 'The guest of honor seated at a gold throne chair at the head table', caption: 'Milestone birthday · 2025', category: 'celebrations' },
  { name: 'guests-dancing-birthday-hall', alt: 'Guests mingling and dancing in a decorated hall', caption: 'Milestone birthday · 2025', category: 'celebrations' },
  { name: 'backyard-cookout-table', alt: 'Family and friends around a long table at a backyard cookout', caption: 'Family cookout · 2026', category: 'celebrations' },
];

/** Atmosphere frames used for the intro burst. */
export const INTRO_FRAMES: PhotoName[] = [
  'couple-kiss-black-gold-drapes',
  'headshot-grey-jacket-arms-crossed',
  'friends-smiling-sofa-birthday',
  'guest-of-honor-cream-suit-portrait',
  'reception-room-hero',
  'couple-black-sequin-wall-gold-balloons',
  'birthday-cakes-carried-in',
  'banquet-couple-royal-blue',
];
