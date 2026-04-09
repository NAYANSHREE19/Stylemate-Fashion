// Real fashion images from Unsplash (free, no auth, 1200x800)
// Organized by style × occasion for best match fallback

const FASHION_IMAGES = {
  // Minimalist
  'minimalist-work': 'https://images.unsplash.com/photo-1548123378-bde4eca81d2d?w=600&q=80',
  'minimalist-casual': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  'minimalist-date': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'minimalist-party': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  'minimalist-wedding': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'minimalist-travel': 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80',

  // Bohemian
  'bohemian-casual': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'bohemian-travel': 'https://images.unsplash.com/photo-1520263115673-610416f52ab6?w=600&q=80',
  'bohemian-date': 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=600&q=80',
  'bohemian-party': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'bohemian-wedding': 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&q=80',
  'bohemian-work': 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',

  // Classic
  'classic-work': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  'classic-date': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'classic-wedding': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
  'classic-casual': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80',
  'classic-party': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80',
  'classic-travel': 'https://images.unsplash.com/photo-1486218119243-13301429de0f?w=600&q=80',

  // Edgy
  'edgy-party': 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80',
  'edgy-casual': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
  'edgy-date': 'https://images.unsplash.com/photo-1519657337289-077653f724ed?w=600&q=80',
  'edgy-work': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
  'edgy-wedding': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'edgy-travel': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',

  // Romantic
  'romantic-date': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f2?w=600&q=80',
  'romantic-wedding': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
  'romantic-party': 'https://images.unsplash.com/photo-1583441424221-5e5e7e6cf2c2?w=600&q=80',
  'romantic-casual': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'romantic-work': 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=600&q=80',
  'romantic-travel': 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
};

// Generic pool used when no specific style+occasion match is found
const GENERIC_FASHION_POOL = [
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
  String(val || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const normalize = (val) => String(val || '').trim().toLowerCase();

const lookupImage = (style, occasion) => {
  const s = slugify(style);
  const occ = occasion.toLowerCase();

  // Map occasion variations to short keys
  const occMap = {
    'work meeting': 'work', 'work': 'work',
    'casual day out': 'casual', 'casual': 'casual',
    'date night': 'date', 'date': 'date',
    'wedding guest': 'wedding', 'wedding': 'wedding',
    'party night': 'party', 'party': 'party',
    'travel day': 'travel', 'travel': 'travel',
  };
  const occKey = occMap[occ] || Object.keys(occMap).find(k => occ.includes(k)) || 'casual';

  // Try exact style+occasion match
  const key = `${s}-${occKey}`;
  if (FASHION_IMAGES[key]) return FASHION_IMAGES[key];

  // Try any match for the style
  const styleMatch = Object.entries(FASHION_IMAGES).find(([k]) => k.startsWith(`${s}-`));
  if (styleMatch) return styleMatch[1];

  return null;
};

export const getFallbackOutfits = (prefs = {}, limit = 4) => {
  const style = normalize(prefs.stylePersonality || prefs.style) || 'minimalist';
  const occasion = normalize(prefs.occasion) || 'casual day out';
  const budget = normalize(prefs.budget) || 'mid-range';
  const bodyType = normalize(prefs.bodyType) || 'rectangle';

  const cappedLimit = Math.max(3, Math.min(4, Number(limit) || 4));
  const results = [];

  // First: try to find specific matches
  const specificImage = lookupImage(style, occasion);
  if (specificImage) {
    results.push({
      image: specificImage,
      tags: [style, occasion, budget, bodyType, 'curated']
    });
  }

  // Fill remaining from generic pool
  const shuffled = [...GENERIC_FASHION_POOL].sort(() => Math.random() - 0.5);
  for (const img of shuffled) {
    if (results.length >= cappedLimit) break;
    if (!results.some(r => r.image === img)) {
      results.push({ image: img, tags: [style, occasion, budget, bodyType] });
    }
  }

  return results.slice(0, cappedLimit);
};

export default GENERIC_FASHION_POOL;
