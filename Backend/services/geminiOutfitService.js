import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  buildGenderedPexelsQuery,
  buildGenderedPrompt,
  normalizeStrictGender
} from './genderPromptService.js';

const DEFAULT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
const DEFAULT_COUNT = 6;

let genAI = null;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
};

const genderInstruction = (gender) => {
  if (gender === 'male') {
    return 'User gender is strictly male. Do NOT generate unisex outfits. Suggest only menswear: shirts, t-shirts, jeans, sneakers, jackets, trousers, loafers, suits. Avoid any womenswear.';
  }
  return 'User gender is strictly female. Do NOT generate unisex outfits. Suggest only womenswear: dresses, skirts, tops, heels, ethnic wear, blouses, sandals. Avoid any menswear.';
};

const sanitizeWardrobeItems = (wardrobeItems) => {
  if (!Array.isArray(wardrobeItems)) return [];

  return wardrobeItems
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (!item || typeof item !== 'object') return '';

      const parts = [
        item.name,
        item.category,
        item.color,
        item.brand,
        item.material,
        item.fit
      ]
        .map((v) => String(v || '').trim())
        .filter(Boolean);

      return parts.join(' | ');
    })
    .filter(Boolean)
    .slice(0, 40);
};

const buildPrompt = ({ wardrobeItems, gender, count }) => {
  const wardrobeText = wardrobeItems.length
    ? wardrobeItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
    : 'No wardrobe items provided.';

  return `
You are an expert personal stylist. Build outfit concepts from the user's wardrobe.

USER PROFILE:
- Gender: ${gender}
- Instruction: ${genderInstruction(gender)}

WARDROBE ITEMS:
${wardrobeText}

TASK:
Generate exactly ${count} outfit concepts using wardrobe items when possible.
Keep recommendations practical, wearable, and coherent.

OUTPUT RULES:
- Return ONLY raw JSON array (no markdown, no commentary).
- Each object must have exactly these keys:
  {
    "outfit": "short title",
    "styling": "2 concise sentences explaining how to style this outfit",
  "pexels_query": "3-6 keywords for stock fashion photo search",
  "image_prompt": "single sentence prompt to generate an image of this outfit"
  }
- Include the selected gender context in wording.
- image_prompt must mention visible garments and styling details.
- Do not use these words: person, individual, model.
- For male image_prompt, begin with: "a stylish young man wearing..."
- For female image_prompt, begin with: "a fashionable woman wearing..."
`.trim();
};

const parseGeminiArray = (text) => {
  const cleaned = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error('Gemini response is not an array');
  }
  return parsed;
};

const normalizeConcept = (entry, gender) => {
  const outfit = String(entry?.outfit || '').trim();
  const styling = String(entry?.styling || '').trim();
  const pexelsQuery = String(entry?.pexels_query || '').trim();
  const imagePrompt = String(entry?.image_prompt || '').trim();

  if (!outfit || !styling || !pexelsQuery || !imagePrompt) {
    return null;
  }

  return {
    outfit,
    styling,
    pexels_query: buildGenderedPexelsQuery(gender, pexelsQuery),
    image_prompt: buildGenderedPrompt(gender, imagePrompt)
  };
};

export const generateWardrobeOutfitConcepts = async ({
  wardrobeItems = [],
  gender = 'female',
  count = DEFAULT_COUNT
} = {}) => {
  const normalizedWardrobe = sanitizeWardrobeItems(wardrobeItems);
  const normalizedGender = normalizeStrictGender(gender);
  const safeCount = Math.max(1, Math.min(12, Number(count) || DEFAULT_COUNT));

  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: DEFAULT_MODEL });
  const prompt = buildPrompt({
    wardrobeItems: normalizedWardrobe,
    gender: normalizedGender,
    count: safeCount
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const parsedArray = parseGeminiArray(text);
  return parsedArray.map((entry) => normalizeConcept(entry, normalizedGender)).filter(Boolean).slice(0, safeCount);
};
