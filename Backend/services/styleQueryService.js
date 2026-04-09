const STYLE_KEYWORDS = {
  romantic: ['romantic', 'soft feminine', 'lace', 'flowy'],
  streetwear: ['streetwear', 'urban', 'oversized', 'sneakers'],
  classic: ['classic', 'timeless', 'tailored', 'clean'],
  minimalist: ['minimalist', 'neutral', 'clean lines', 'simple'],
  edgy: ['edgy', 'bold', 'leather', 'statement'],
  bohemian: ['bohemian', 'boho', 'flowy', 'textured'],
  preppy: ['preppy', 'polished', 'layered', 'smart casual'],
  vintage: ['vintage', 'retro', 'classic', 'old-school'],
  sporty: ['sporty', 'athleisure', 'activewear', 'comfortable'],
  glamorous: ['glamorous', 'elegant', 'luxury', 'chic'],
  'smart casual': ['smart casual', 'polished', 'modern', 'versatile'],
  luxury: ['luxury', 'designer', 'premium', 'elevated']
};

const uniqueTokens = (tokens = []) => {
  const seen = new Set();
  const result = [];
  for (const token of tokens) {
    const key = String(token || '').trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(String(token).trim());
  }
  return result;
};

export const getStyleKeywords = (style = '') => {
  const normalized = String(style || '').trim().toLowerCase();
  return STYLE_KEYWORDS[normalized] || [normalized].filter(Boolean);
};

export const buildStrictStyleQuery = ({ style, occasion, baseQuery }) => {
  const tokens = uniqueTokens([
    ...getStyleKeywords(style),
    String(occasion || '').trim(),
    String(baseQuery || '').trim()
  ]);

  return tokens.join(' ').trim();
};
