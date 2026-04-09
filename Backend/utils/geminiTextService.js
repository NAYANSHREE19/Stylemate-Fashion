import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  buildGenderedPexelsQuery,
  buildGenderedPrompt,
  normalizeStrictGender
} from '../services/genderPromptService.js';

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const generateOutfitConcepts = async (preferences, gender, count = 6) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const normalizedGender = normalizeStrictGender(gender);
  const genderContext =
    normalizedGender === 'male'
      ? 'User gender is strictly male. Do NOT generate unisex outfits. Only menswear: shirts, t-shirts, jeans, sneakers, jackets, trousers, loafers, suits. No womenswear.'
      : 'User gender is strictly female. Do NOT generate unisex outfits. Only womenswear: dresses, skirts, tops, heels, ethnic, blouses, sandals. No menswear.';

  const prompt = `
You are an expert personal stylist. Generate exactly ${count} highly curated outfit combinations based on the user's profile.

USER DEMOGRAPHIC:
Gender: ${normalizedGender}
${genderContext}

USER PREFERENCES:
Style: ${preferences.style || 'Casual'}
Occasion: ${preferences.occasion || 'Everyday'}
Body Type: ${preferences.bodyType || 'Average'}
Vibe/Mood: ${Array.isArray(preferences.mood) ? preferences.mood.join(', ') : (preferences.mood || '')}
Season: ${preferences.season || 'All season'}
Budget: ${preferences.budget || 'Mid-range'}

REQUIREMENTS:
Return a valid RAW JSON array of objects. Do NOT use markdown code blocks.
Each object must match this schema exactly:
{
  "outfit": "Short title of the outfit concept",
  "styling": "Detailed 2-sentence description of the outfit styling choices and why it fits their preferences.",
  "pexels_query": "3-5 keyword query optimized for Pexels stock photos representing this exact outfit. Example: 'minimalist streetwear male fashion'",
  "image_prompt": "A detailed 1-sentence physical description. For male MUST start with 'a stylish young man wearing...'. For female MUST start with 'a fashionable woman wearing...'. Do not use person, individual, model."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry) => ({
        outfit: String(entry?.outfit || '').trim(),
        styling: String(entry?.styling || '').trim(),
        pexels_query: buildGenderedPexelsQuery(normalizedGender, entry?.pexels_query || ''),
        image_prompt: buildGenderedPrompt(normalizedGender, entry?.image_prompt || '')
      }))
      .filter((entry) => entry.outfit && entry.styling && entry.pexels_query && entry.image_prompt)
      .slice(0, count);
  } catch (error) {
    console.error('Gemini text generation failed:', error.message);
    throw error;
  }
};
