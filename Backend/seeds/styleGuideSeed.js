import Outfit from '../models/Outfit.js';

// Comprehensive Style Guide Sample Data
const sampleStyles = [
  {
    title: "Minimalist Chic",
    description: "Embrace simplicity with clean lines and neutral tones. This style focuses on quality over quantity, creating a sophisticated and timeless wardrobe.",
    vibe: "Effortless elegance meets modern sophistication",
    category: "Casual",
    occasion: "Casual",
    season: "All Season",
    stylePersonality: ["Minimalist", "Classic"],
    tags: ["minimalist", "neutral", "timeless", "elegant", "modern"],
    colorPalette: [
      { name: "Ivory", hex: "#F5F5F0", role: "primary" },
      { name: "Charcoal", hex: "#36454F", role: "primary" },
      { name: "Sand", hex: "#C2B280", role: "secondary" },
      { name: "Stone Grey", hex: "#928E85", role: "neutral" },
      { name: "Off White", hex: "#FAF9F6", role: "accent" }
    ],
    keyPieces: [
      { item: "White Button-Down Shirt", description: "Crisp cotton, perfectly tailored", priority: "essential" },
      { item: "Black Slim Trousers", description: "High-quality fabric with clean cut", priority: "essential" },
      { item: "Minimalist Watch", description: "Sleek design, leather strap", priority: "recommended" },
      { item: "White Sneakers", description: "Clean, modern silhouette", priority: "essential" },
      { item: "Structured Tote", description: "Neutral leather, medium size", priority: "recommended" }
    ],
    accessories: ["Gold stud earrings", "Minimalist watch", "Leather belt", "Simple ring"],
    celebrities: [
      { name: "Emma Watson", imageUrl: "https://via.placeholder.com/100?text=EW" },
      { name: "Gwyneth Paltrow", imageUrl: "https://via.placeholder.com/100?text=GP" },
      { name: "Jennifer Aniston", imageUrl: "https://via.placeholder.com/100?text=JA" }
    ],
    stylingTips: {
      dos: [
        "Invest in high-quality basics that will last for years",
        "Stick to a neutral color palette for maximum versatility",
        "Focus on perfect fit - tailoring is key",
        "Choose timeless pieces over trendy items",
        "Less is more - avoid over-accessorizing"
      ],
      donts: [
        "Don't mix too many textures in one outfit",
        "Avoid loud prints and patterns",
        "Don't wear oversized everything - balance is crucial",
        "Skip flashy logos and branding",
        "Avoid cheap fabrics that pill or wrinkle easily"
      ],
      mixingTips: [
        "Add a pop of color with a silk scarf or leather bag",
        "Layer different shades of neutrals for depth",
        "Mix casual and formal pieces for a polished look",
        "Combine different textures like cotton and wool"
      ]
    },
    suitableBodyTypes: ["All"],
    priceRange: "Premium",
    difficulty: "Beginner",
    bestFor: ["Professionals", "Anyone seeking timeless style", "Capsule wardrobe enthusiasts"],
    rating: 4.8,
    ratingCount: 234,
    likes: 1250,
    saves: 890,
    views: 5600,
    trending: true,
    featured: true,
    isPublic: true,
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format&fit=crop"
  },
  {
    title: "Bohemian Wanderer",
    description: "Free-spirited and artistic, this style combines flowing fabrics, earthy tones, and eclectic patterns for a laid-back yet stylish aesthetic.",
    vibe: "Carefree spirit with an artistic soul",
    category: "Casual",
    occasion: "Casual",
    season: "Summer",
    stylePersonality: ["Bohemian", "Romantic"],
    tags: ["boho", "flowy", "earthy", "artistic", "relaxed"],
    colorPalette: [
      { name: "Terracotta", hex: "#E2725B", role: "primary" },
      { name: "Sage Green", hex: "#9CAF88", role: "primary" },
      { name: "Mustard", hex: "#FFDB58", role: "accent" },
      { name: "Cream", hex: "#FFFDD0", role: "neutral" },
      { name: "Rust", hex: "#B7410E", role: "secondary" }
    ],
    keyPieces: [
      { item: "Maxi Dress", description: "Flowing fabric with ethnic print", priority: "essential" },
      { item: "Embroidered Jacket", description: "Denim or suede with boho details", priority: "recommended" },
      { item: "Leather Sandals", description: "Flat, strappy design", priority: "essential" },
      { item: "Fringe Bag", description: "Crossbody or hobo style", priority: "recommended" },
      { item: "Wide-Brim Hat", description: "Straw or felt, for sun protection", priority: "optional" }
    ],
    accessories: ["Layered necklaces", "Hoop earrings", "Woven bracelets", "Headband"],
    celebrities: [
      { name: "Vanessa Hudgens", imageUrl: "https://via.placeholder.com/100?text=VH" },
      { name: "Sienna Miller", imageUrl: "https://via.placeholder.com/100?text=SM" },
      { name: "Florence Welch", imageUrl: "https://via.placeholder.com/100?text=FW" }
    ],
    stylingTips: {
      dos: [
        "Layer jewelry for a collected-over-time look",
        "Mix prints and patterns boldly",
        "Choose natural, breathable fabrics",
        "Embrace flowing silhouettes",
        "Add personal touches like vintage finds"
      ],
      donts: [
        "Don't be too matchy-matchy",
        "Avoid stiff, structured pieces",
        "Skip synthetic fabrics",
        "Don't overthink it - boho is about being effortless",
        "Avoid too many dark colors"
      ],
      mixingTips: [
        "Pair a boho dress with a leather jacket for edge",
        "Mix ethnic prints with solid neutrals",
        "Combine vintage and modern pieces",
        "Layer different lengths for visual interest"
      ]
    },
    suitableBodyTypes: ["Hourglass", "Pear", "Rectangle"],
    priceRange: "Moderate",
    difficulty: "Intermediate",
    bestFor: ["Free spirits", "Festival-goers", "Creative professionals", "Beach lovers"],
    rating: 4.6,
    ratingCount: 189,
    likes: 980,
    saves: 720,
    views: 4200,
    trending: true,
    isPublic: true,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format&fit=crop"
  },
  {
    title: "Power Business",
    description: "Command the boardroom with sharp tailoring and confident silhouettes. This style exudes professionalism without sacrificing personal style.",
    vibe: "Confident, commanding, and professional",
    category: "Business",
    occasion: "Work",
    season: "All Season",
    stylePersonality: ["Classic", "Edgy"],
    tags: ["business", "professional", "tailored", "power", "sophisticated"],
    colorPalette: [
      { name: "Navy", hex: "#000080", role: "primary" },
      { name: "Crisp White", hex: "#FFFFFF", role: "primary" },
      { name: "Burgundy", hex: "#800020", role: "accent" },
      { name: "Grey", hex: "#808080", role: "neutral" },
      { name: "Black", hex: "#000000", role: "secondary" }
    ],
    keyPieces: [
      { item: "Tailored Blazer", description: "Sharp shoulders, perfect fit", priority: "essential" },
      { item: "Pencil Skirt", description: "Knee-length, structured fabric", priority: "essential" },
      { item: "Silk Blouse", description: "Quality fabric, classic cut", priority: "essential" },
      { item: "Pumps", description: "Classic pointed toe, 3-inch heel", priority: "essential" },
      { item: "Structured Briefcase", description: "Leather, professional style", priority: "recommended" }
    ],
    accessories: ["Statement watch", "Pearl earrings", "Silk scarf", "Leather belt"],
    celebrities: [
      { name: "Amal Clooney", imageUrl: "https://via.placeholder.com/100?text=AC" },
      { name: "Victoria Beckham", imageUrl: "https://via.placeholder.com/100?text=VB" },
      { name: "Meghan Markle", imageUrl: "https://via.placeholder.com/100?text=MM" }
    ],
    stylingTips: {
      dos: [
        "Invest in tailoring - fit is everything",
        "Choose quality fabrics that drape well",
        "Keep accessories minimal and sophisticated",
        "Maintain crisp, clean lines",
        "Build a versatile mix-and-match wardrobe"
      ],
      donts: [
        "Don't wear anything too tight or revealing",
        "Avoid overly casual fabrics like jersey",
        "Skip trendy pieces that date quickly",
        "Don't overload on accessories",
        "Avoid wrinkled or poorly maintained clothing"
      ],
      mixingTips: [
        "Add a pop of color with a silk blouse",
        "Mix masculine and feminine pieces",
        "Layer a turtleneck under a blazer in winter",
        "Pair tailored pants with a flowing blouse for balance"
      ]
    },
    suitableBodyTypes: ["All"],
    priceRange: "Premium",
    difficulty: "Intermediate",
    bestFor: ["Corporate professionals", "Executives", "Lawyers", "Consultants"],
    rating: 4.9,
    ratingCount: 312,
    likes: 1580,
    saves: 1120,
    views: 7800,
    featured: true,
    isPublic: true,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
  },
  {
    title: "Streetwear Edge",
    description: "Urban cool meets high fashion with oversized silhouettes, bold graphics, and sneaker culture influence. Perfect for the fashion-forward trendsetter.",
    vibe: "Urban, rebellious, and unapologetically bold",
    category: "Casual",
    occasion: "Casual",
    season: "All Season",
    stylePersonality: ["Streetwear", "Edgy"],
    tags: ["streetwear", "urban", "sneakers", "oversized", "trendy"],
    colorPalette: [
      { name: "Black", hex: "#000000", role: "primary" },
      { name: "White", hex: "#FFFFFF", role: "primary" },
      { name: "Neon Green", hex: "#39FF14", role: "accent" },
      { name: "Grey", hex: "#808080", role: "neutral" },
      { name: "Red", hex: "#FF0000", role: "secondary" }
    ],
    keyPieces: [
      { item: "Oversized Hoodie", description: "Premium cotton, graphic details", priority: "essential" },
      { item: "Jogger Pants", description: "Tapered fit, quality fabric", priority: "essential" },
      { item: "High-Top Sneakers", description: "Limited edition or classic style", priority: "essential" },
      { item: "Bomber Jacket", description: "Nylon or satin, bold colors", priority: "recommended" },
      { item: "Crossbody Bag", description: "Technical fabric, multiple pockets", priority: "optional" }
    ],
    accessories: ["Baseball cap", "Chain necklace", "Sports watch", "Sunglasses"],
    celebrities: [
      { name: "Rihanna", imageUrl: "https://via.placeholder.com/100?text=RH" },
      { name: "Kanye West", imageUrl: "https://via.placeholder.com/100?text=KW" },
      { name: "Bella Hadid", imageUrl: "https://via.placeholder.com/100?text=BH" }
    ],
    stylingTips: {
      dos: [
        "Mix high and low fashion pieces",
        "Embrace oversized silhouettes strategically",
        "Keep sneakers clean and fresh",
        "Layer pieces for depth and interest",
        "Express yourself with bold graphics or colors"
      ],
      donts: [
        "Don't overdo it - balance is key",
        "Avoid all-logo everything",
        "Don't forget proper fit even with oversized pieces",
        "Skip dirty or worn-out sneakers",
        "Avoid trying too hard - keep it authentic"
      ],
      mixingTips: [
        "Pair streetwear with tailored pieces for high-low mix",
        "Add designer accessories to elevate the look",
        "Mix vintage athletic wear with modern pieces",
        "Combine sporty and luxe elements"
      ]
    },
    suitableBodyTypes: ["Rectangle", "Inverted Triangle", "Apple"],
    priceRange: "Moderate",
    difficulty: "Advanced",
    bestFor: ["Trendsetters", "Sneakerheads", "Young professionals", "Creative types"],
    rating: 4.7,
    ratingCount: 276,
    likes: 2100,
    saves: 1450,
    views: 9200,
    trending: true,
    isPublic: true,
    imageUrl: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800"
  },
  {
    title: "Romantic Evening",
    description: "Elegant femininity with soft fabrics, delicate details, and dreamy silhouettes. Perfect for date nights and special occasions.",
    vibe: "Soft, feminine, and enchanting",
    category: "Evening",
    occasion: "Date",
    season: "All Season",
    stylePersonality: ["Romantic", "Classic"],
    tags: ["romantic", "feminine", "elegant", "date-night", "soft"],
    colorPalette: [
      { name: "Blush Pink", hex: "#FFB6C1", role: "primary" },
      { name: "Champagne", hex: "#F7E7CE", role: "primary" },
      { name: "Rose Gold", hex: "#B76E79", role: "accent" },
      { name: "Ivory", hex: "#FFFFF0", role: "neutral" },
      { name: "Lavender", hex: "#E6E6FA", role: "secondary" }
    ],
    keyPieces: [
      { item: "Silk Slip Dress", description: "Midi length, delicate straps", priority: "essential" },
      { item: "Lace Top", description: "Romantic details, quality fabric", priority: "recommended" },
      { item: "Strappy Heels", description: "Elegant, comfortable height", priority: "essential" },
      { item: "Clutch Bag", description: "Embellished or satin finish", priority: "recommended" },
      { item: "Wrap Cardigan", description: "Soft cashmere or silk", priority: "optional" }
    ],
    accessories: ["Delicate jewelry", "Pearl earrings", "Dainty bracelet", "Hair accessories"],
    celebrities: [
      { name: "Taylor Swift", imageUrl: "https://via.placeholder.com/100?text=TS" },
      { name: "Lily James", imageUrl: "https://via.placeholder.com/100?text=LJ" },
      { name: "Elle Fanning", imageUrl: "https://via.placeholder.com/100?text=EF" }
    ],
    stylingTips: {
      dos: [
        "Choose soft, flowing fabrics that move gracefully",
        "Layer delicate jewelry for a feminine touch",
        "Embrace pastel and neutral tones",
        "Add romantic details like ruffles or lace",
        "Keep makeup soft and natural"
      ],
      donts: [
        "Don't go too heavy with makeup",
        "Avoid harsh colors or bold patterns",
        "Skip chunky or edgy accessories",
        "Don't overdo the romance - keep it tasteful",
        "Avoid overly casual fabrics or styles"
      ],
      mixingTips: [
        "Add a leather jacket for edge",
        "Mix romantic pieces with modern minimalist items",
        "Pair a feminine dress with ankle boots",
        "Balance soft tops with structured bottoms"
      ]
    },
    suitableBodyTypes: ["Hourglass", "Pear", "Rectangle"],
    priceRange: "Moderate",
    difficulty: "Beginner",
    bestFor: ["Date nights", "Weddings", "Garden parties", "Romantic getaways"],
    rating: 4.5,
    ratingCount: 198,
    likes: 890,
    saves: 650,
    views: 3800,
    isPublic: true,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
  },
  {
    title: "Athleisure Active",
    description: "Sporty meets stylish with performance fabrics and athletic-inspired pieces that work for both gym and street.",
    vibe: "Active, healthy, and effortlessly cool",
    category: "Sports",
    occasion: "Gym",
    season: "All Season",
    stylePersonality: ["Athleisure", "Minimalist"],
    tags: ["athleisure", "sporty", "comfortable", "active", "lifestyle"],
    colorPalette: [
      { name: "Black", hex: "#000000", role: "primary" },
      { name: "White", hex: "#FFFFFF", role: "primary" },
      { name: "Coral", hex: "#FF7F50", role: "accent" },
      { name: "Grey", hex: "#D3D3D3", role: "neutral" },
      { name: "Navy", hex: "#000080", role: "secondary" }
    ],
    keyPieces: [
      { item: "Sports Leggings", description: "High-waisted, moisture-wicking", priority: "essential" },
      { item: "Crop Top", description: "Supportive, breathable fabric", priority: "essential" },
      { item: "Sneakers", description: "Performance or lifestyle style", priority: "essential" },
      { item: "Bomber Jacket", description: "Athletic-inspired, lightweight", priority: "recommended" },
      { item: "Gym Bag", description: "Stylish yet functional", priority: "optional" }
    ],
    accessories: ["Sports watch", "Water bottle", "Headband", "Gym bag"],
    celebrities: [
      { name: "Gigi Hadid", imageUrl: "https://via.placeholder.com/100?text=GH" },
      { name: "Kendall Jenner", imageUrl: "https://via.placeholder.com/100?text=KJ" },
      { name: "Hailey Bieber", imageUrl: "https://via.placeholder.com/100?text=HB" }
    ],
    stylingTips: {
      dos: [
        "Choose quality performance fabrics",
        "Keep it sleek with matching sets",
        "Invest in good sneakers",
        "Layer with athletic-inspired outerwear",
        "Accessorize with sporty elements"
      ],
      donts: [
        "Don't wear actual gym clothes everywhere",
        "Avoid overly baggy or ill-fitting pieces",
        "Skip worn-out athletic wear",
        "Don't forget proper support for activities",
        "Avoid too many logos and branding"
      ],
      mixingTips: [
        "Pair leggings with an oversized blazer",
        "Mix athletic pieces with denim",
        "Add a leather jacket over a sports bra",
        "Combine sporty and feminine elements"
      ]
    },
    suitableBodyTypes: ["All"],
    priceRange: "Moderate",
    difficulty: "Beginner",
    bestFor: ["Active lifestyle", "Gym-goers", "Running errands", "Travel"],
    rating: 4.4,
    ratingCount: 223,
    likes: 1100,
    saves: 780,
    views: 5200,
    isPublic: true,
    imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
  }
];

// Seed function
export const seedStyleGuide = async () => {
  try {
    console.log('🌱 Starting Style Guide seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Outfit.deleteMany({});
    console.log('✅ Cleared existing styles');

    // Insert sample data
    const insertedStyles = await Outfit.insertMany(sampleStyles);
    console.log(`✅ Successfully seeded ${insertedStyles.length} styles`);

    return {
      success: true,
      count: insertedStyles.length,
      data: insertedStyles
    };
  } catch (error) {
    console.error('❌ Error seeding style guide:', error);
    throw error;
  }
};

// Export for use in seed script
export default sampleStyles;
