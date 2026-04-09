// Recommendation engine - generates outfit recommendations based on user preferences

const formatPreferenceValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  return value || null;
};

export function buildRecommendationReason(preferences = {}, recommendation = {}) {
  const parts = [];

  const styleValue = formatPreferenceValue(preferences.stylePersonality);
  if (styleValue) {
    parts.push(`${styleValue} style`);
  }

  if (preferences.lifestyle) {
    parts.push(`${preferences.lifestyle} lifestyle`);
  }

  if (preferences.budget) {
    parts.push(`${preferences.budget} budget`);
  }

  if (preferences.bodyType) {
    parts.push(`${preferences.bodyType} body type`);
  }

  if (parts.length === 0) {
    return 'Recommended based on your latest style preferences.';
  }

  const titlePart = recommendation?.title ? `for ${recommendation.title}` : '';
  return `Recommended${titlePart} because it matches your ${parts.join(', ')}.`;
}

export function generateRecommendations(preferences) {
  const { lifestyle, stylePersonality, colorPreferences, bodyType, budget } = preferences;

  const recommendations = [];

  // Generate recommendations based on lifestyle
  if (lifestyle === 'Corporate') {
    recommendations.push({
      title: 'Professional Power Look',
      description: 'A sophisticated ensemble perfect for important meetings and presentations.',
      items: [
        'Tailored blazer in neutral tone',
        'Crisp white button-down shirt',
        'Straight-leg trousers',
        'Classic leather pumps',
        'Structured leather tote'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Business', 'Professional', 'Classic', 'Corporate']
    });

    recommendations.push({
      title: 'Business Casual Elegance',
      description: 'Polished yet comfortable for everyday office wear.',
      items: [
        'Fitted blazer',
        'Silk blouse',
        'Midi pencil skirt',
        'Low-heel loafers',
        'Minimalist watch'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Business Casual', 'Office', 'Elegant']
    });
  }

  if (lifestyle === 'Creative') {
    recommendations.push({
      title: 'Artistic Expression',
      description: 'Unique pieces that showcase your creative personality.',
      items: [
        'Statement oversized blazer',
        'Graphic tee or printed blouse',
        'Wide-leg trousers or culottes',
        'Chunky platform sneakers',
        'Bold accessories'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Creative', 'Artistic', 'Bold', 'Unique']
    });
  }

  if (lifestyle === 'Casual') {
    recommendations.push({
      title: 'Everyday Comfort',
      description: 'Effortlessly stylish for your daily activities.',
      items: [
        'Soft knit sweater',
        'High-waisted jeans',
        'White sneakers',
        'Canvas tote bag',
        'Dainty jewelry'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Casual', 'Comfortable', 'Everyday', 'Relaxed']
    });

    recommendations.push({
      title: 'Weekend Warrior',
      description: 'Perfect for brunches, shopping, and casual outings.',
      items: [
        'Oversized sweater or hoodie',
        'Leggings or joggers',
        'Slip-on sneakers',
        'Crossbody bag',
        'Baseball cap'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Weekend', 'Casual', 'Athleisure']
    });
  }

  if (lifestyle === 'Social') {
    recommendations.push({
      title: 'Party Ready',
      description: 'Turn heads at any social gathering.',
      items: [
        'Sequined mini dress or jumpsuit',
        'Strappy heels',
        'Statement clutch',
        'Bold earrings',
        'Leather jacket for edge'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Party', 'Evening', 'Glamorous', 'Social']
    });
  }

  // Add recommendations based on style personality
  if (stylePersonality.includes('Minimalist')) {
    recommendations.push({
      title: 'Minimalist Chic',
      description: 'Clean lines and neutral tones for a timeless look.',
      items: [
        'White cotton tee',
        'Black tailored pants',
        'Beige trench coat',
        'White leather sneakers',
        'Simple gold jewelry'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Minimalist', 'Clean', 'Timeless', 'Neutral']
    });
  }

  if (stylePersonality.includes('Bohemian')) {
    recommendations.push({
      title: 'Boho Dreamer',
      description: 'Free-spirited and flowing with earthy vibes.',
      items: [
        'Flowing maxi dress',
        'Crochet vest',
        'Leather sandals',
        'Fringe bag',
        'Layered necklaces'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Bohemian', 'Boho', 'Earthy', 'Flowing']
    });
  }

  if (stylePersonality.includes('Edgy')) {
    recommendations.push({
      title: 'Rebel Style',
      description: 'Bold and daring with an urban edge.',
      items: [
        'Leather moto jacket',
        'Band tee',
        'Ripped black jeans',
        'Combat boots',
        'Studded accessories'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Edgy', 'Rock', 'Urban', 'Bold']
    });
  }

  if (stylePersonality.includes('Romantic')) {
    recommendations.push({
      title: 'Romantic Evening',
      description: 'Soft and feminine with delicate details.',
      items: [
        'Floral midi dress',
        'Lace cardigan',
        'Ballet flats',
        'Pearl accessories',
        'Pastel clutch'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Romantic', 'Feminine', 'Delicate', 'Soft']
    });
  }

  // Body type specific recommendations
  if (bodyType === 'Pear') {
    recommendations.push({
      title: 'Balanced Silhouette',
      description: 'Emphasize your upper body and balance proportions.',
      items: [
        'Boat-neck or off-shoulder top',
        'A-line skirt in dark color',
        'Structured blazer',
        'Pointed-toe heels',
        'Statement necklace'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Pear Body', 'Flattering', 'Balanced']
    });
  }

  if (bodyType === 'Hourglass') {
    recommendations.push({
      title: 'Hourglass Glamour',
      description: 'Highlight your curves with fitted pieces.',
      items: [
        'Wrap dress',
        'High-waisted pants',
        'Fitted blazer',
        'Belted coat',
        'V-neck tops'
      ],
      imageUrl: '/api/placeholder/400/500',
      tags: ['Hourglass', 'Curves', 'Fitted']
    });
  }

  // Ensure at least 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push(
      {
        title: 'Versatile All-Rounder',
        description: 'A go-to outfit that works for multiple occasions.',
        items: [
          'Blazer',
          'Basic tee',
          'Dark jeans',
          'Ankle boots',
          'Crossbody bag'
        ],
        imageUrl: '/api/placeholder/400/500',
        tags: ['Versatile', 'All-Occasion', 'Classic']
      },
      {
        title: 'Smart Casual',
        description: 'Polished yet relaxed for various settings.',
        items: [
          'Knit sweater',
          'Chinos or dress pants',
          'Loafers',
          'Leather belt',
          'Watch'
        ],
        imageUrl: '/api/placeholder/400/500',
        tags: ['Smart Casual', 'Versatile', 'Polished']
      }
    );
  }

  // Return top 5 recommendations with contextual explanation
  return recommendations.slice(0, 5).map((recommendation) => ({
    ...recommendation,
    reason: buildRecommendationReason(preferences, recommendation)
  }));
}
