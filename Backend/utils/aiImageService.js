import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const LOCAL_AI_URL = process.env.LOCAL_AI_URL || 'http://127.0.0.1:8000/generate';
const LOCAL_AI_TIMEOUT_MS = Number(process.env.LOCAL_AI_TIMEOUT_MS || 240000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-image';

const QUALITY_SUFFIX =
  'photorealistic fashion photo, natural skin texture, realistic fabric detail, soft studio lighting';

const NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, sketch, cgi, 3d render, doll face, plastic skin, monochrome, grayscale, color cast, blurry, lowres, deformed anatomy, extra limbs, watermark, logo, text';

const MAX_PROMPT_WORDS = Number(process.env.MAX_PROMPT_WORDS || 90);
let geminiClient = null;
let geminiBlockedUntil = 0;
let geminiBlockReason = '';

const clampPromptWords = (prompt, maxWords = MAX_PROMPT_WORDS) => {
  const words = String(prompt || '').trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return words.slice(0, maxWords).join(' ');
};

const STYLE_GARMENT_FOCUS = {
  minimalist: 'clean monochrome tailoring, straight-leg trousers, minimal accessories',
  bohemian: 'flowing silhouettes, textured layers, artisanal accessories',
  classic: 'structured blazer, polished shirt, refined tailoring',
  edgy: 'statement outerwear, sharp silhouette, bold accessories',
  romantic: 'soft drape, feminine detailing, elegant layering',
  casual: 'smart-casual staples with clean proportions',
  corporate: 'office-ready suiting with crisp tailoring'
};

const ANGLE_VARIANTS = [
  'front view, eye-level',
  'three-quarter view',
  'runway walk pose',
  'street style candid',
  'studio standing pose',
  'walking editorial pose'
];

const COMBINATION_VARIANTS = [
  'coordinated layered outfit with polished accessories',
  'modern mix-and-match silhouette',
  'clean capsule styling',
  'tailored flattering fit',
  'cohesive color harmony',
  'occasion-focused premium finish'
];

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeColorPreferences = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeText(entry)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => normalizeText(entry))
      .filter(Boolean);
  }

  return [];
};

const buildDynamicPrompt = ({ style, occasion, budget }) =>
  `Full body fashion model wearing a stylish ${style} outfit for ${occasion}, ${budget} fashion, realistic, ultra detailed, 4k, studio lighting`;

const buildBasePrompt = ({
  style,
  lifestyle,
  budget,
  bodyType,
  occasion,
  colorPreferences
}) => {
  const effectiveStyle = style;
  const styleKey = effectiveStyle.toLowerCase();
  const garmentFocus =
    STYLE_GARMENT_FOCUS[styleKey] || 'cohesive fashion styling with realistic fabrics and flattering fit';
  const colorsText = colorPreferences.length
    ? `colors: ${colorPreferences.join(', ')}.`
    : 'colors: balanced modern tones.';

  return [
    buildDynamicPrompt({ style: effectiveStyle, occasion, budget }),
    `lifestyle focus: ${lifestyle}. body type fit focus: ${bodyType}.`,
    `styling: ${garmentFocus}.`,
    colorsText,
    'realistic wearable outfit, occasion-appropriate.',
    QUALITY_SUFFIX
  ].join(' ');
};

const dedupePrompts = (prompts) => {
  const seen = new Set();
  return prompts.filter((prompt) => {
    const key = prompt.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const parseRetryDelayMs = (retryDelayRaw = '') => {
  const retryDelay = String(retryDelayRaw || '').trim();
  if (!retryDelay) return 0;

  const secondsMatch = retryDelay.match(/^(\d+)(?:\.\d+)?s$/i);
  if (secondsMatch) {
    return Number(secondsMatch[1]) * 1000;
  }

  const millisMatch = retryDelay.match(/^(\d+)ms$/i);
  if (millisMatch) {
    return Number(millisMatch[1]);
  }

  return 0;
};

const isGeminiQuotaError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return Number(error?.status) === 429 || message.includes('quota') || message.includes('too many requests');
};

const isGeminiZeroQuotaError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('limit: 0') || message.includes('free_tier_requests') || message.includes('free_tier_input_token_count');
};

const getGeminiRetryMs = (error) => {
  const retryInfo = (error?.errorDetails || []).find((detail) =>
    String(detail?.['@type'] || '').includes('RetryInfo')
  );

  const retryFromInfo = parseRetryDelayMs(retryInfo?.retryDelay);
  if (retryFromInfo > 0) return retryFromInfo;

  return 60000;
};

export const buildPrompt = (userPrefs = {}) => {
  const normalizedPrefs = {
    style: normalizeText(userPrefs.style || userPrefs.stylePersonality) || 'Minimalist',
    lifestyle: normalizeText(userPrefs.lifestyle) || 'Casual',
    budget: normalizeText(userPrefs.budget) || 'Mid-range',
    bodyType: normalizeText(userPrefs.bodyType) || 'Rectangle',
    occasion: normalizeText(userPrefs.occasion) || 'Casual day out',
    colorPreferences: normalizeColorPreferences(userPrefs.colorPreferences)
  };

  return clampPromptWords(buildBasePrompt(normalizedPrefs));
};

export const buildPromptVariations = (userPrefs = {}, count = 6) => {
  const basePrompt = buildPrompt(userPrefs);
  const candidatePrompts = [];

  for (let index = 0; index < Math.max(count, 6); index += 1) {
    const angle = ANGLE_VARIANTS[index % ANGLE_VARIANTS.length];
    const combo = COMBINATION_VARIANTS[index % COMBINATION_VARIANTS.length];
    const variationDetail = `outfit variation ${index + 1}`;
    // Keep unique variation tokens at the start so word-clamping does not collapse all prompts.
    candidatePrompts.push(clampPromptWords(`${variationDetail}. ${angle}. ${combo}. ${basePrompt}`));
  }

  return dedupePrompts(candidatePrompts).slice(0, count);
};

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
};

export const generateGeminiImage = async (prompt) => {
  if (Date.now() < geminiBlockedUntil) {
    throw new Error(
      `Gemini is temporarily blocked until ${new Date(geminiBlockedUntil).toISOString()}. ${geminiBlockReason}`.trim()
    );
  }

  console.log('Using Gemini AI');

  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE']
    }
  });
  let response;

  try {
    const result = await model.generateContent(prompt);
    response = await result.response;
  } catch (error) {
    if (isGeminiQuotaError(error)) {
      const retryMs = isGeminiZeroQuotaError(error)
        ? Math.max(getGeminiRetryMs(error), 30 * 60 * 1000)
        : getGeminiRetryMs(error);

      geminiBlockedUntil = Date.now() + retryMs;
      geminiBlockReason = isGeminiZeroQuotaError(error)
        ? 'Gemini quota is currently zero for this project (likely billing/quota setup).'
        : 'Gemini rate-limited; waiting before retrying.';

      console.warn(
        `Gemini unavailable: ${geminiBlockReason} Falling back to Local SDXL for now.`
      );
    }

    throw error;
  }

  const directInlineData = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  const allParts = response?.candidates?.[0]?.content?.parts || [];
  const inlineData = directInlineData || allParts.find((part) => part?.inlineData)?.inlineData;

  const base64Data = typeof inlineData?.data === 'string' ? inlineData.data.trim() : '';
  if (!base64Data) {
    throw new Error('Gemini returned no image data');
  }

  return `data:image/png;base64,${base64Data}`;
};

export const callLocalAI = async (prompt) => {
  return callLocalSDXL(prompt);
};

export const callLocalSDXL = async (prompt) => {
  console.log('Using Local SDXL');

  const response = await axios.post(
    LOCAL_AI_URL,
    { prompt, negative_prompt: NEGATIVE_PROMPT },
    {
      timeout: LOCAL_AI_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    }
  );

  if (response.status >= 400) {
    throw new Error(`Local AI server failed with status ${response.status}`);
  }

  const base64Image = typeof response.data?.image === 'string' ? response.data.image.trim() : '';

  if (!base64Image) {
    throw new Error('Local AI server returned empty image payload');
  }

  if (base64Image.startsWith('data:image/')) {
    return base64Image;
  }

  return `data:image/png;base64,${base64Image}`;
};

export const generateOutfitImage = async (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('A valid prompt is required for image generation');
  }

  try {
    // Gemini (primary)
    return await generateGeminiImage(prompt);
  } catch (geminiError) {
    console.warn(`Gemini failed: ${geminiError?.message || 'unknown Gemini error'}`);

    try {
      // Local SDXL (secondary)
      return await callLocalSDXL(prompt);
    } catch (localError) {
      throw new Error(
        `Gemini and Local SDXL failed. Gemini: ${geminiError?.message || 'unknown'}. Local SDXL: ${localError?.message || 'unknown'}.`
      );
    }
  }
};
