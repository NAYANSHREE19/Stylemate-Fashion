export const normalizeStrictGender = (gender) => {
  const value = String(gender || '').trim().toLowerCase();
  if (value === 'male' || value === 'man' || value === 'men') return 'male';
  if (value === 'female' || value === 'woman' || value === 'women') return 'female';
  // Keep strict non-neutral behavior for legacy users with missing gender.
  return 'male';
};

export function buildGenderedPrompt(gender, basePrompt) {
  const strictGender = normalizeStrictGender(gender);
  const cleanedBasePrompt = String(basePrompt || '').trim();

  if (strictGender === 'male') {
    return `A stylish young man, male model, menswear fashion, ${cleanedBasePrompt}`;
  }
  return `A fashionable woman, female model, womenswear fashion, ${cleanedBasePrompt}`;
}

export const buildGenderedPexelsQuery = (gender, pexelsQuery) => {
  const strictGender = normalizeStrictGender(gender);
  const baseQuery = String(pexelsQuery || '').trim();

  if (strictGender === 'male') {
    return `mens casual outfit male model men outfit menswear male fashion ${baseQuery}`.trim();
  }
  return `womens outfit female model women outfit womenswear female fashion ${baseQuery}`.trim();
};
