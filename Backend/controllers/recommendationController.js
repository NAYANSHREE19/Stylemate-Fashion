import Outfit from '../models/Outfit.js';
import User from '../models/User.js';
import RecommendationFeedback from '../models/RecommendationFeedback.js';
import { buildRecommendationReason } from '../utils/recommendationEngine.js';
import { buildHybridRecommendation } from '../services/hybridRecommendationService.js';

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.quizCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the quiz first to get recommendations'
      });
    }

    // AI-first flow with strict response budget.
    const hybridResult = await Promise.race([
      buildHybridRecommendation(user, 1),
      new Promise((resolve) => setTimeout(() => resolve(null), 7800))
    ]);

    if (hybridResult) {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [hybridResult]
      });
    }

    const { lifestyle, stylePersonality, budget } = user.preferences;

    // Build query based on user preferences
    const query = {
      isPublic: true,
      $or: []
    };

    // Match style personality
    if (stylePersonality && stylePersonality.length > 0) {
      query.$or.push({ stylePersonality: { $in: stylePersonality } });
    }

    // If no specific criteria, get all public outfits
    if (query.$or.length === 0) {
      delete query.$or;
    }

    const outfits = await Outfit.find(query)
      .sort({ rating: -1, likes: -1 })
      .limit(20);

    const preferences = {
      lifestyle,
      stylePersonality,
      budget,
      bodyType: user.preferences?.bodyType
    };

    const recommendationsWithReason = outfits.map((outfit) => {
      const recommendation = outfit.toObject();
      recommendation.reason = buildRecommendationReason(preferences, recommendation);
      return recommendation;
    });

    return res.status(200).json({
      success: true,
      count: recommendationsWithReason.length,
      data: recommendationsWithReason
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recommendations by occasion
// @route   GET /api/recommendations/occasion/:occasion
// @access  Private
export const getRecommendationsByOccasion = async (req, res) => {
  try {
    const { occasion } = req.params;

    const outfits = await Outfit.find({
      occasion,
      isPublic: true
    })
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: outfits.length,
      data: outfits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recommendations by category
// @route   GET /api/recommendations/category/:category
// @access  Private
export const getRecommendationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const outfits = await Outfit.find({
      category,
      isPublic: true
    })
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: outfits.length,
      data: outfits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single outfit
// @route   GET /api/recommendations/:id
// @access  Public
export const getOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id).populate('createdBy', 'name avatar');

    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: outfit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit recommendation feedback
// @route   POST /api/recommendations/feedback
// @access  Private
export const submitRecommendationFeedback = async (req, res) => {
  try {
    const { outfitId, feedback, name, title, prompt } = req.body;
    const resolvedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    const promptKey = resolvedPrompt
      ? `ai-prompt-${Buffer.from(resolvedPrompt).toString('base64').slice(0, 24)}`
      : '';
    const resolvedOutfitId =
      (typeof outfitId === 'string' && outfitId.trim()) ||
      (typeof name === 'string' && name.trim()) ||
      (typeof title === 'string' && title.trim()) ||
      promptKey ||
      '';

    if (!resolvedOutfitId) {
      return res.status(400).json({
        success: false,
        message: 'outfitId is required'
      });
    }

    if (!['like', 'dislike'].includes(feedback)) {
      return res.status(400).json({
        success: false,
        message: 'feedback must be either like or dislike'
      });
    }

    const record = await RecommendationFeedback.findOneAndUpdate(
      { user: req.user.id, outfitId: resolvedOutfitId },
      { feedback, prompt: resolvedPrompt },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Feedback saved successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
