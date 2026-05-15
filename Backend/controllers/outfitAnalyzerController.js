import { analyzeOutfitImage } from '../services/outfitAnalyzerService.js';
import { fetchPexelsImages } from '../utils/pexelsService.js';
import {
  buildGenderedPexelsQuery,
  normalizeStrictGender
} from '../services/genderPromptService.js';

export const analyzeOutfit = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image is required. Please upload an outfit photo.'
      });
    }

    // ── Build user profile from auth + body ──────────────
    const userProfile = {
      gender: normalizeStrictGender(req.user?.gender || req.body.gender || 'female'),
      bodyType: req.body.bodyType || req.user?.preferences?.bodyType || '',
      stylePersonality: req.body.stylePersonality || req.user?.preferences?.stylePersonality || []
    };

    console.log(`🔍 Analyzing outfit for ${userProfile.gender} user...`);

    // ── 1. AI Analysis ───────────────────────────────────
    let analysis;
    try {
      analysis = await analyzeOutfitImage(image, userProfile);
    } catch (aiError) {
      console.error('Gemini analysis failed:', aiError.message);
      return res.status(500).json({
        success: false,
        message: 'AI analysis failed. Please try again with a clearer image.'
      });
    }

    // ── 2. Fetch similar outfit recommendations ──────────
    let recommendations = [];
    const searchQueries = analysis.similarSearchQueries || [];

    for (const query of searchQueries.slice(0, 3)) {
      try {
        const genderedQuery = buildGenderedPexelsQuery(userProfile.gender, query);
        const pexelsResults = await fetchPexelsImages(genderedQuery);

        for (const result of pexelsResults.slice(0, 2)) {
          // Avoid duplicates
          if (!recommendations.some(r => r.image === result.image)) {
            recommendations.push({
              image: result.image,
              description: result.description || query,
              tags: result.tags || [query],
              source: 'pexels'
            });
          }
        }
      } catch (pexelsError) {
        console.warn('Pexels fetch failed for query:', query);
      }
    }

    // Limit to 6 recommendations
    recommendations = recommendations.slice(0, 6);

    console.log(`✅ Analysis complete. Score: ${analysis.matchScore}/100. ${recommendations.length} recommendations found.`);

    return res.status(200).json({
      success: true,
      data: {
        analysis,
        recommendations
      }
    });

  } catch (error) {
    console.error('analyzeOutfit error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze outfit'
    });
  }
};
