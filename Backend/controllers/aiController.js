import { fetchPexelsImages } from '../utils/pexelsService.js';
import { getFallbackOutfits } from '../data/fallbackOutfits.js';
import { generateOutfitConcepts } from '../utils/geminiTextService.js';
import { generateWardrobeOutfitConcepts } from '../services/geminiOutfitService.js';
import {
  buildGenderedPexelsQuery,
  buildGenderedPrompt,
  normalizeStrictGender
} from '../services/genderPromptService.js';
import { buildStrictStyleQuery } from '../services/styleQueryService.js';

const REQUIRED_FIELDS = ['style', 'occasion'];

export const generateAIOutfits = async (req, res) => {
  try {
    const targetCount = Math.max(6, Number(process.env.AI_RESPONSE_COUNT || 6));

    const normalized = {
      style: (req.body.style || req.body.stylePersonality || '').trim(),
      occasion: (req.body.occasion || '').trim(),
      gender: normalizeStrictGender(req.user?.gender || req.body.gender),
      budget: (req.body.budget || '').trim(),
      bodyType: (req.body.bodyType || '').trim(),
      lifestyle: (req.body.lifestyle || '').trim(),
      mood: Array.isArray(req.body.mood) ? req.body.mood : [],
      season: (req.body.season || '').trim(),
      colorPreferences: Array.isArray(req.body.colorPreferences) ? req.body.colorPreferences : []
    };

    if (!normalized.style || !normalized.occasion) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: style, occasion'
      });
    }

    // ── 1. Gemini Text Inference ─────────────────────────
    let geminiConcepts = [];
    try {
      console.log(`Pinging Gemini for gender-aware outfits. Gender: ${normalized.gender}`);
      if (Array.isArray(req.body.wardrobe) && req.body.wardrobe.length > 0) {
        geminiConcepts = await generateWardrobeOutfitConcepts({
          wardrobeItems: req.body.wardrobe,
          gender: normalized.gender,
          count: targetCount
        });
      } else {
        geminiConcepts = await generateOutfitConcepts(normalized, normalized.gender, targetCount);
      }
    } catch (geminiError) {
      console.warn('Gemini concept generation failed (falling back to direct queries):', geminiError.message);
    }

    let outfits = [];

    // ── 2. Build Final Image Pipeline ────────────────────
    if (geminiConcepts && geminiConcepts.length > 0) {
      for (const concept of geminiConcepts) {
        // Query must enforce gender heavily so stock photos don't mess up
        const strictStyleQuery = buildStrictStyleQuery({
          style: normalized.style,
          occasion: normalized.occasion,
          baseQuery: concept.pexels_query
        });
        const strictPexelsQuery = buildGenderedPexelsQuery(normalized.gender, strictStyleQuery);
        try {
          const pexelsResults = await fetchPexelsImages(strictPexelsQuery);
          if (pexelsResults.length > 0) {
            // we just need the FIRST best image for this specific concept
            const bestResult = pexelsResults[0];
            outfits.push({
              image: bestResult.image,
              description: concept.styling,
              tags: [normalized.style.toLowerCase(), normalized.gender],
              prompt: buildGenderedPrompt(normalized.gender, concept.image_prompt),
              source: 'gemini+pexels'
            });
          }
        } catch (e) {
          console.warn('Failed to fetch Pexels for concept:', concept.outfit);
        }
      }
    }

    // ── 3. Fallback Pipeline (if Gemini failed/timed out) ──
    if (outfits.length < targetCount) {
      const remaining = targetCount - outfits.length;
      console.log(`Falling back to generic Pexels for ${remaining} images`);
      const strictFallbackStyleQuery = buildStrictStyleQuery({
        style: normalized.style || 'fashion',
        occasion: normalized.occasion || 'casual',
        baseQuery: 'outfit editorial'
      });
      const fallbackQuery = buildGenderedPexelsQuery(normalized.gender, strictFallbackStyleQuery);
      try {
        const pexelsResults = await fetchPexelsImages(fallbackQuery);
        const extra = pexelsResults
          .filter(r => !outfits.some(o => o.image === r.image))
          .map(result => ({
            image: result.image,
            description: result.description,
            tags: [...result.tags, normalized.style.toLowerCase(), normalized.gender],
            prompt: fallbackQuery,
            source: 'pexels-fallback'
          }));
        outfits.push(...extra.slice(0, remaining));
      } catch (fallbackError) {
        console.warn('Pexels generic fallback failed:', fallbackError.message);
      }
    }

    // ── 3rd attempt: last-resort dataset ─────────────────
    if (outfits.length === 0) {
      const fallbackItems = getFallbackOutfits(normalized, targetCount);
      outfits = fallbackItems.map((fallback, index) => ({
        image: fallback.image,
        description: `${normalized.style} curated outfit ${index + 1} for ${normalized.occasion}.`,
        tags: fallback.tags.map(tag => tag.toLowerCase().replace(/\s+/g, '-')),
        prompt: 'dataset-fallback',
        source: 'dataset'
      }));
    }

    outfits = outfits.slice(0, targetCount);

    return res.status(200).json(outfits);

  } catch (error) {
    console.error('generateAIOutfits error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch outfits'
    });
  }
};
