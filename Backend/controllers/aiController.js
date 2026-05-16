import axios from 'axios';
import { getFallbackOutfits } from '../data/fallbackOutfits.js';
import { generateOutfitConcepts } from '../utils/geminiTextService.js';
import { generateWardrobeOutfitConcepts } from '../services/geminiOutfitService.js';
import {
  buildGenderedPrompt,
  normalizeStrictGender
} from '../services/genderPromptService.js';

const REQUIRED_FIELDS = ['style', 'occasion'];

/**
 * Helper to call Hugging Face Inference API
 */
const queryHuggingFace = async (prompt) => {
  const hfToken = process.env.HF_API_TOKEN;
  if (!hfToken) throw new Error('HF_API_TOKEN not configured');

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
    { inputs: prompt },
    {
      headers: { Authorization: `Bearer ${hfToken}` },
      responseType: 'arraybuffer',
      timeout: 30000
    }
  );
  return Buffer.from(response.data, 'binary').toString('base64');
};

export const generateAIOutfits = async (req, res) => {
  try {
    const targetCount = Math.max(4, Number(process.env.AI_RESPONSE_COUNT || 4));

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
      console.warn('Gemini concept generation failed:', geminiError.message);
    }

    let outfits = [];

    // ── 2. SDXL Turbo Image Generation ────────────────────
    if (geminiConcepts && geminiConcepts.length > 0) {
      console.log(`Generating ${geminiConcepts.length} images with SDXL Turbo...`);
      
      // Run generation sequentially to avoid overwhelming the python server
      for (const concept of geminiConcepts) {
        const basePrompt = buildGenderedPrompt(normalized.gender, concept.image_prompt);
        const finalPrompt = basePrompt + ", photorealistic fashion editorial, 8k, detailed, high fashion, sharp focus, beautiful lighting";
        
        try {
          const imageBase64 = await queryHuggingFace(finalPrompt);
          
          if (imageBase64) {
            outfits.push({
              image: `data:image/png;base64,${imageBase64}`,
              description: concept.styling,
              tags: [normalized.style.toLowerCase(), normalized.gender],
              prompt: finalPrompt,
              source: 'huggingface-sdxl'
            });
          }
        } catch (e) {
          console.warn('Failed to generate image from Hugging Face:', e.message);
        }
      }
    }

    // ── 3. Fallback Pipeline (if AI Server failed) ──
    if (outfits.length === 0) {
      console.log("Falling back to dataset...");
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

export const remixOutfit = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required for remixing' });
    }

    console.log(`Remixing outfit with prompt: ${prompt}`);
    
    // Add slightly different style keywords to guarantee variation
    const variationPrompt = prompt + ", variation, alternative style, slightly different angle";

    try {
      const imageBase64 = await queryHuggingFace(variationPrompt);
      
      if (imageBase64) {
        return res.status(200).json({
          success: true,
          image: `data:image/png;base64,${imageBase64}`
        });
      } else {
        throw new Error('Failed to generate variation');
      }
    } catch (error) {
      console.error('remixOutfit error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to remix outfit'
      });
    }
  } catch (outerError) {
    console.error('Outer remixOutfit error:', outerError);
    return res.status(500).json({
      success: false,
      message: outerError.message || 'Server error during remix'
    });
  }
};
