// Real fashion images from Unsplash (free, no auth needed)
// Used as client-side fallback when backend returns no images

const FASHION_IMAGES = {
  'minimalist-work': 'https://images.unsplash.com/photo-1548123378-bde4eca81d2d?w=600&q=80',
  'minimalist-casual': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  'minimalist-date': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'minimalist-party': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  'minimalist-wedding': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'minimalist-travel': 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80',
  'bohemian-casual': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'bohemian-travel': 'https://images.unsplash.com/photo-1520263115673-610416f52ab6?w=600&q=80',
  'bohemian-date': 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=600&q=80',
  'bohemian-party': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'bohemian-wedding': 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&q=80',
  'bohemian-work': 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
  'classic-work': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  'classic-date': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'classic-wedding': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
  'classic-casual': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80',
  'classic-party': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80',
  'classic-travel': 'https://images.unsplash.com/photo-1486218119243-13301429de0f?w=600&q=80',
  'edgy-party': 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80',
  'edgy-casual': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
  'edgy-date': 'https://images.unsplash.com/photo-1519657337289-077653f724ed?w=600&q=80',
  'edgy-work': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
  'edgy-wedding': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'edgy-travel': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'romantic-date': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f2?w=600&q=80',
  'romantic-wedding': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
  'romantic-party': 'https://images.unsplash.com/photo-1583441424221-5e5e7e6cf2c2?w=600&q=80',
  'romantic-casual': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'romantic-work': 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=600&q=80',
  'romantic-travel': 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
};

const GENERIC_POOL = [
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=600&q=80',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  'https://images.unsplash.com/photo-1548123378-bde4eca81d2d?w=600&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
];

const slugify = (val) =>
  String(val || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalize = (val) => String(val || '').trim().toLowerCase();

const OCC_MAP = {
  // original
  'work meeting': 'work',
  'work': 'work',
  'casual day out': 'casual',
  'casual': 'casual',
  'date night': 'date',
  'date': 'date',
  'wedding guest': 'wedding',
  'wedding': 'wedding',
  'party night': 'party',
  'party': 'party',
  'travel day': 'travel',
  'travel': 'travel',
  // expanded quiz occasions
  'daily college wear': 'casual',
  'office / corporate': 'work',
  'business casual': 'work',
  'festive (diwali, puja)': 'party',
  'travel / airport': 'travel',
  'gym / active': 'casual',
  'brunch / café': 'casual',
  'brunch / cafe': 'casual',
  'night out / club': 'party',
  'family function': 'wedding',
  'interview / professional': 'work',
};

const lookupImage = (style, occasion) => {
  const s = slugify(style);
  const occ = normalize(occasion);
  const occKey = OCC_MAP[occ] || Object.keys(OCC_MAP).find((k) => occ.includes(k)) || 'casual';
  const exact = FASHION_IMAGES[`${s}-${occKey}`];
  if (exact) return exact;
  // Any image for this style
  const styleEntry = Object.entries(FASHION_IMAGES).find(([k]) => k.startsWith(`${s}-`));
  return styleEntry?.[1] || null;
};

export const getClientFallbackOutfits = (filters = {}, base = {}, count = 6) => {
  const style = normalize(filters.style) || 'minimalist';
  const occasion = normalize(filters.occasion) || 'casual day out';
  const budget = normalize(filters.budget) || 'mid-range';
  const bodyType = normalize(base.bodyType) || 'rectangle';

  const cappedCount = Math.max(3, Math.min(count, 6));
  const results = [];

  // Best match first
  const specific = lookupImage(style, occasion);
  if (specific) {
    results.push({
      id: `fallback-${slugify(style)}-${slugify(occasion)}-1`,
      image: specific,
      description: `${filters.style} curated outfit for ${filters.occasion}.`,
      tags: [style, occasion, budget, bodyType, 'curated'],
      prompt: 'client-fallback',
    });
  }

  // Fill with shuffled generic pool
  const pool = [...GENERIC_POOL].sort(() => Math.random() - 0.5);
  let idx = 2;
  for (const img of pool) {
    if (results.length >= cappedCount) break;
    if (results.some((r) => r.image === img)) continue;
    results.push({
      id: `fallback-${slugify(style)}-${slugify(occasion)}-${idx}`,
      image: img,
      description: `${filters.style} curated outfit ${idx} for ${filters.occasion}.`,
      tags: [style, occasion, budget, bodyType],
      prompt: 'client-fallback',
    });
    idx++;
  }

  return results.slice(0, cappedCount);
};

export default GENERIC_POOL;
