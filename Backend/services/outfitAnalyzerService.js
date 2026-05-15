import { GoogleGenerativeAI } from '@google/generative-ai';
import { normalizeStrictGender } from './genderPromptService.js';

const DEFAULT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';

let genAI = null;

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  if (!genAI) genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

// ── Build the analysis prompt ────────────────────────────────────
const buildAnalysisPrompt = (userProfile) => {
  const gender = normalizeStrictGender(userProfile.gender);
  const bodyType = userProfile.bodyType || 'not specified';
  const stylePersonality = Array.isArray(userProfile.stylePersonality)
    ? userProfile.stylePersonality.join(', ')
    : userProfile.stylePersonality || 'not specified';

  return `
You are a world-class fashion stylist and color theory expert.
Analyze the outfit shown in this image for the following user profile:

USER PROFILE:
- Gender: ${gender}
- Body Type: ${bodyType}
- Style Personality: ${stylePersonality}

ANALYZE THESE ASPECTS:
1. **Overall Match Score** (0-100): How well does this outfit combination work?
2. **Color Harmony** (Poor / Fair / Good / Excellent): Do the colors complement each other?
3. **Style Coherence** (Poor / Fair / Good / Excellent): Do all pieces belong to the same style family?
4. **Occasion Suitability**: What occasions is this outfit best suited for?
5. **Body Type Fit**: How well does this suit the user's body type?
6. **Verdict**: One-sentence summary of the outfit
7. **Strengths**: 2-3 things that work well
8. **Improvements**: 2-3 specific suggestions to improve this outfit
9. **Styling Tips**: 2-3 actionable tips (accessories, layering, swaps)
10. **Similar Style Keywords**: 5-6 keywords to search for similar outfits on a stock photo site (gender-appropriate)

OUTPUT FORMAT:
Return ONLY a raw JSON object (no markdown, no code fences), with exactly these keys:
{
  "matchScore": <number 0-100>,
  "colorHarmony": "<Poor|Fair|Good|Excellent>",
  "styleCoherence": "<Poor|Fair|Good|Excellent>",
  "occasionSuitability": ["<occasion1>", "<occasion2>"],
  "bodyTypeFit": "<sentence>",
  "verdict": "<one sentence>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"],
  "stylingTips": ["<tip1>", "<tip2>", "<tip3>"],
  "similarSearchQueries": ["<query1>", "<query2>", "<query3>"],
  "detectedItems": ["<item1>", "<item2>"],
  "dominantColors": ["<color1>", "<color2>"]
}
`.trim();
};

// ── Parse Gemini response ────────────────────────────────────────
const parseAnalysis = (text) => {
  const cleaned = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  // Validate required keys
  if (typeof parsed.matchScore !== 'number') {
    parsed.matchScore = 50;
  }
  parsed.matchScore = Math.max(0, Math.min(100, parsed.matchScore));

  // Ensure arrays
  const arrayFields = [
    'occasionSuitability', 'strengths', 'improvements',
    'stylingTips', 'similarSearchQueries', 'detectedItems', 'dominantColors'
  ];
  for (const field of arrayFields) {
    if (!Array.isArray(parsed[field])) {
      parsed[field] = [];
    }
  }

  // Ensure strings
  const stringFields = ['colorHarmony', 'styleCoherence', 'bodyTypeFit', 'verdict'];
  for (const field of stringFields) {
    if (typeof parsed[field] !== 'string') {
      parsed[field] = 'Not assessed';
    }
  }

  return parsed;
};

// ── Main analysis function ───────────────────────────────────────
export const analyzeOutfitImage = async (imageBase64, userProfile = {}) => {
  const client = getClient();
  const model = client.getGenerativeModel({ model: DEFAULT_MODEL });

  // Strip data URL prefix if present
  let cleanBase64 = imageBase64;
  let mimeType = 'image/jpeg';

  if (imageBase64.startsWith('data:')) {
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      cleanBase64 = match[2];
    } else {
      cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    }
  }

  const prompt = buildAnalysisPrompt(userProfile);

  const imagePart = {
    inlineData: {
      data: cleanBase64,
      mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  return parseAnalysis(text);
};
