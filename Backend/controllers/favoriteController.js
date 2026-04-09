import Favorite from '../models/Favorite.js';
import Outfit from '../models/Outfit.js';

// @desc    Get all favorites for user
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('outfit')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add outfit to favorites
// @route   POST /api/favorites/:outfitId
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { outfitId } = req.params;

    // Check if outfit exists
    const outfit = await Outfit.findById(outfitId);
    if (!outfit) {
      return res.status(404).json({
        success: false,
        message: 'Outfit not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      outfit: outfitId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Outfit already in favorites'
      });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      user: req.user.id,
      outfit: outfitId
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove outfit from favorites
// @route   DELETE /api/favorites/:outfitId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const { outfitId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      outfit: outfitId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if outfit is favorited
// @route   GET /api/favorites/check/:outfitId
// @access  Private
export const checkFavorite = async (req, res) => {
  try {
    const { outfitId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      outfit: outfitId
    });

    res.status(200).json({
      success: true,
      data: { isFavorited: !!favorite }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
