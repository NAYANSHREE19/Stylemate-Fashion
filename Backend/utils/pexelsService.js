import axios from 'axios';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'or', 'for', 'with', 'the', 'outfit', 'fashion', 'style', 'model', 'wearing'
]);

const scorePhotoAgainstQuery = (photo, query) => {
  const queryTokens = String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token && token.length > 2 && !STOP_WORDS.has(token));

  const altText = String(photo?.alt || '').toLowerCase();
  if (!queryTokens.length || !altText) return 0;

  let score = 0;
  for (const token of queryTokens) {
    if (altText.includes(token)) score += 1;
  }

  // Slight boost for stronger gender alignment in alt text.
  const hasMale = queryTokens.includes('male') || queryTokens.includes('menswear') || queryTokens.includes('men');
  const hasFemale =
    queryTokens.includes('female') || queryTokens.includes('womenswear') || queryTokens.includes('women');
  if (hasMale && /(male|men|menswear)/.test(altText)) score += 2;
  if (hasFemale && /(female|women|womenswear)/.test(altText)) score += 2;

  return score;
};

export const fetchPexelsImages = async (query) => {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('PEXELS_API_KEY is missing');
  }

  const response = await axios.get('https://api.pexels.com/v1/search', {
    params: {
      query,
      per_page: 15
    },
    headers: {
      Authorization: apiKey
    }
  });

  if (response.status !== 200) {
    throw new Error(`Pexels API failed with status ${response.status}`);
  }

  const photos = response.data.photos || [];
  
  if (photos.length === 0) {
    throw new Error('No images found on Pexels for the given query');
  }

  const rankedPhotos = [...photos].sort(
    (a, b) => scorePhotoAgainstQuery(b, query) - scorePhotoAgainstQuery(a, query)
  );

  return rankedPhotos.map(photo => {
    return {
      image: photo.src.large || photo.src.medium, // Prefer large or medium
      description: photo.alt || 'Fashion outfit from Pexels',
      tags: photo.alt ? photo.alt.split(' ').slice(0, 3).map(w => w.toLowerCase()) : ['fashion', 'outfit', 'pexels']
    };
  });
};
