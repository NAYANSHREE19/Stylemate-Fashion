import WardrobeItem from '../models/WardrobeItem.js';
import { generateWardrobeOutfitConcepts } from './geminiOutfitService.js';
import { generateAIImage } from '../utils/aiServerService.js';
import { fetchPexelsImages } from '../utils/pexelsService.js';
import {
  buildGenderedPexelsQuery,
  buildGenderedPrompt,
  normalizeStrictGender
} from './genderPromptService.js';

const toDataUri = (base64) => {
  if (typeof base64 !== 'string' || !base64.trim()) return null;
  const value = base64.trim();
  return value.startsWith('data:image/') ? value : `data:image/png;base64,${value}`;
};

const mapWardrobeForPrompt = (items) =>
  items.map((item) => ({
    name: item.name,
    category: item.category,
    color: item.color,
    brand: item.brand
  }));

const buildFallbackConcept = (user) => {
  const style = user?.preferences?.stylePersonality?.[0] || 'casual';
  const occasion = user?.preferences?.occasion || 'everyday';
  const gender = normalizeStrictGender(user?.gender);
  const baseImagePrompt =
    gender === 'male'
      ? `${style} ${occasion} menswear look with shirt, jeans, sneakers and jacket styling`
      : `${style} ${occasion} womenswear look with top, skirt or dress, and heels or sandals`;

  return {
    outfit: `${style} ${occasion} look`,
    styling: `A ${style} outfit tuned for ${occasion}, balanced for comfort and polish.`,
    pexels_query: buildGenderedPexelsQuery(gender, `${style} ${occasion} fashion outfit`),
    image_prompt: buildGenderedPrompt(gender, baseImagePrompt)
  };
};

export const buildHybridRecommendation = async (user, count = 1) => {
  const strictGender = normalizeStrictGender(user?.gender);
  const wardrobeItems = await WardrobeItem.find({ user: user._id })
    .sort({ updatedAt: -1 })
    .limit(30)
    .lean();

  let concepts = [];
  try {
    concepts = await generateWardrobeOutfitConcepts({
      wardrobeItems: mapWardrobeForPrompt(wardrobeItems),
      gender: strictGender,
      count
    });
  } catch (error) {
    concepts = [];
  }

  if (!concepts.length) {
    concepts = [buildFallbackConcept(user)];
  }

  const concept = concepts[0];
  const aiImageBase64 = await generateAIImage(buildGenderedPrompt(strictGender, concept.image_prompt));

  if (aiImageBase64) {
    return {
      outfit: concept.outfit,
      styling: concept.styling,
      image_url: toDataUri(aiImageBase64)
    };
  }

  try {
    const pexelsResults = await fetchPexelsImages(
      buildGenderedPexelsQuery(strictGender, concept.pexels_query)
    );
    const firstImage = pexelsResults?.[0]?.image || null;
    if (firstImage) {
      return {
        outfit: concept.outfit,
        styling: concept.styling,
        image_url: firstImage
      };
    }
  } catch (error) {
    // keep null fallback behavior at service boundary
  }

  return null;
};
