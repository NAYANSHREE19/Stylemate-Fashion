import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Outfit from '../models/Outfit.js';

dotenv.config();

const sampleOutfits = [
  {
    title: 'Minimalist Chic',
    description: 'A timeless ensemble combining clean lines with neutral tones for effortless elegance.',
    items: [
      'White cotton t-shirt',
      'Black tailored trousers',
      'Beige trench coat',
      'White leather sneakers',
      'Simple gold jewelry'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Casual',
    tags: ['minimalist', 'neutral', 'timeless', 'everyday'],
    season: 'All Season',
    occasion: 'Casual',
    stylePersonality: ['Minimalist', 'Classic'],
    rating: 4.8,
    likes: 245,
    isPublic: true
  },
  {
    title: 'Business Professional',
    description: 'Command attention in the boardroom with this sophisticated power outfit.',
    items: [
      'Navy blazer',
      'Crisp white button-down',
      'Grey pencil skirt',
      'Black leather pumps',
      'Structured leather tote'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Business',
    tags: ['professional', 'corporate', 'formal', 'office'],
    season: 'All Season',
    occasion: 'Work',
    stylePersonality: ['Classic'],
    rating: 4.9,
    likes: 312,
    isPublic: true
  },
  {
    title: 'Boho Festival Vibes',
    description: 'Free-spirited and flowy, perfect for outdoor concerts and festivals.',
    items: [
      'Floral maxi dress',
      'Denim vest',
      'Leather sandals',
      'Fringe crossbody bag',
      'Layered necklaces and bangles'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Casual',
    tags: ['bohemian', 'festival', 'boho', 'summer'],
    season: 'Summer',
    occasion: 'Party',
    stylePersonality: ['Bohemian'],
    rating: 4.7,
    likes: 189,
    isPublic: true
  },
  {
    title: 'Romantic Evening',
    description: 'Soft, feminine, and utterly enchanting for date nights.',
    items: [
      'Blush pink midi dress',
      'Lace cardigan',
      'Nude ballet flats',
      'Pearl drop earrings',
      'Satin clutch'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Evening',
    tags: ['romantic', 'feminine', 'date night', 'elegant'],
    season: 'Spring',
    occasion: 'Date',
    stylePersonality: ['Romantic'],
    rating: 4.6,
    likes: 156,
    isPublic: true
  },
  {
    title: 'Urban Edge',
    description: 'Bold street style with an attitude for the city explorer.',
    items: [
      'Black leather jacket',
      'Graphic band tee',
      'Ripped skinny jeans',
      'Combat boots',
      'Studded backpack'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Casual',
    tags: ['edgy', 'street style', 'urban', 'rock'],
    season: 'Fall',
    occasion: 'Casual',
    stylePersonality: ['Edgy'],
    rating: 4.8,
    likes: 278,
    isPublic: true
  },
  {
    title: 'Weekend Brunch',
    description: 'Casual yet polished for leisurely weekend outings.',
    items: [
      'Oversized knit sweater',
      'High-waisted mom jeans',
      'White canvas sneakers',
      'Tote bag',
      'Cat-eye sunglasses'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Casual',
    tags: ['weekend', 'brunch', 'relaxed', 'comfortable'],
    season: 'All Season',
    occasion: 'Casual',
    stylePersonality: ['Minimalist', 'Classic'],
    rating: 4.5,
    likes: 198,
    isPublic: true
  },
  {
    title: 'Glamorous Night Out',
    description: 'Turn heads with this show-stopping party ensemble.',
    items: [
      'Sequined mini dress',
      'Strappy stiletto heels',
      'Metallic clutch',
      'Statement chandelier earrings',
      'Bold red lip'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Evening',
    tags: ['party', 'glamorous', 'night out', 'clubbing'],
    season: 'All Season',
    occasion: 'Party',
    stylePersonality: ['Edgy', 'Romantic'],
    rating: 4.9,
    likes: 456,
    isPublic: true
  },
  {
    title: 'Athleisure Chic',
    description: 'Sporty meets stylish for active lifestyles.',
    items: [
      'Cropped hoodie',
      'High-waisted leggings',
      'Chunky sneakers',
      'Baseball cap',
      'Gym crossbody bag'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Sports',
    tags: ['athleisure', 'sporty', 'active', 'gym'],
    season: 'All Season',
    occasion: 'Gym',
    stylePersonality: ['Minimalist'],
    rating: 4.4,
    likes: 167,
    isPublic: true
  },
  {
    title: 'Smart Business Casual',
    description: 'Strike the perfect balance between professional and relaxed.',
    items: [
      'Cashmere sweater',
      'Tailored chinos',
      'Leather loafers',
      'Leather belt',
      'Classic wristwatch'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Business',
    tags: ['business casual', 'smart casual', 'office', 'comfortable'],
    season: 'All Season',
    occasion: 'Work',
    stylePersonality: ['Classic', 'Minimalist'],
    rating: 4.7,
    likes: 223,
    isPublic: true
  },
  {
    title: 'Vacation Resort Wear',
    description: 'Breezy and stylish for tropical getaways.',
    items: [
      'Linen button-down shirt',
      'White shorts',
      'Espadrille sandals',
      'Straw tote',
      'Oversized sunhat'
    ],
    imageUrl: '/api/placeholder/400/500',
    category: 'Casual',
    tags: ['vacation', 'resort', 'tropical', 'summer'],
    season: 'Summer',
    occasion: 'Travel',
    stylePersonality: ['Bohemian', 'Minimalist'],
    rating: 4.6,
    likes: 201,
    isPublic: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB Connected');

    // Clear existing outfits
    await Outfit.deleteMany({});
    console.log('🗑️  Cleared existing outfits');

    // Insert sample outfits
    await Outfit.insertMany(sampleOutfits);
    console.log(`✨ Inserted ${sampleOutfits.length} sample outfits`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
