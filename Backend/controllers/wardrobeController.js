import WardrobeItem from '../models/WardrobeItem.js';

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

const ALLOWED_WARDROBE_CATEGORIES = new Set([
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Others'
]);

const normalizeWardrobeCategory = (category) => {
  if (!category || typeof category !== 'string') return 'Others';
  return ALLOWED_WARDROBE_CATEGORIES.has(category) ? category : 'Others';
};

const normalizeWardrobeSource = (source) => {
  if (!source || typeof source !== 'string') return 'Manual';
  if (source === 'AI' || source === 'Recommendation' || source === 'Manual') {
    return source;
  }
  return 'Manual';
};

// @desc    Get all wardrobe items for user
// @route   GET /api/wardrobe
// @access  Private
export const getWardrobeItems = async (req, res) => {
  try {
    const { category, season, occasion, isFavorite } = req.query;

    const query = { user: req.user.id };

    if (category) query.category = category;
    if (season) query.season = { $in: [season] };
    if (occasion) query.occasion = { $in: [occasion] };
    if (isFavorite === 'true') query.isFavorite = true;

    const items = await WardrobeItem.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single wardrobe item
// @route   GET /api/wardrobe/:id
// @access  Private
export const getWardrobeItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Wardrobe item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add wardrobe item
// @route   POST /api/wardrobe
// @access  Private
export const addWardrobeItem = async (req, res) => {
  try {
    const requestBody = req.body || {};
    const sourceOutfitId = requestBody.sourceOutfitId || requestBody.outfitId || null;

    const itemData = {
      ...requestBody,
      name: requestBody.name || requestBody.title,
      category: normalizeWardrobeCategory(requestBody.category),
      color: requestBody.color || 'Unknown',
      imageUrl: requestBody.imageUrl || requestBody.image || null,
      image: requestBody.image || requestBody.imageUrl || null,
      source: normalizeWardrobeSource(requestBody.source),
      sourceOutfitId,
      tags: Array.isArray(requestBody.tags)
        ? requestBody.tags
        : requestBody.tags
          ? [requestBody.tags]
          : [],
      season: Array.isArray(requestBody.season)
        ? requestBody.season
        : requestBody.season
          ? [requestBody.season]
          : [],
      occasion: Array.isArray(requestBody.occasion)
        ? requestBody.occasion
        : requestBody.occasion
          ? [requestBody.occasion]
          : [],
      user: req.user.id
    };

    if (!itemData.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide item name'
      });
    }

    const duplicateQuery = sourceOutfitId
      ? { user: req.user.id, sourceOutfitId }
      : {
          user: req.user.id,
          name: itemData.name,
          imageUrl: itemData.imageUrl || null
        };

    const existingItem = await WardrobeItem.findOne(duplicateQuery);
    if (existingItem) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: 'Item already exists in wardrobe',
        data: existingItem
      });
    }

    const item = await WardrobeItem.create(itemData);

    res.status(201).json({
      success: true,
      message: 'Item added to wardrobe',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update wardrobe item
// @route   PUT /api/wardrobe/:id
// @access  Private
export const updateWardrobeItem = async (req, res) => {
  try {
    let item = await WardrobeItem.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Wardrobe item not found'
      });
    }

    item = await WardrobeItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Wardrobe item updated',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete wardrobe item
// @route   DELETE /api/wardrobe/:id
// @access  Private
export const deleteWardrobeItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Wardrobe item not found'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Wardrobe item deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/wardrobe/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const item = await WardrobeItem.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Wardrobe item not found'
      });
    }

    item.isFavorite = !item.isFavorite;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item ${item.isFavorite ? 'added to' : 'removed from'} favorites`,
      data: { isFavorite: item.isFavorite }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Increment times worn
// @route   PATCH /api/wardrobe/:id/wear
// @access  Private
export const incrementTimesWorn = async (req, res) => {
  try {
    const item = await WardrobeItem.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Wardrobe item not found'
      });
    }

    item.timesWorn += 1;
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Times worn updated',
      data: { timesWorn: item.timesWorn }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get wardrobe statistics
// @route   GET /api/wardrobe/stats
// @access  Private
export const getWardrobeStats = async (req, res) => {
  try {
    const totalItems = await WardrobeItem.countDocuments({ user: req.user.id });
    const favoriteItems = await WardrobeItem.countDocuments({ user: req.user.id, isFavorite: true });

    const categoryStats = await WardrobeItem.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const mostWornItems = await WardrobeItem.find({ user: req.user.id })
      .sort({ timesWorn: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        favoriteItems,
        categoryStats,
        mostWornItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Analyze clothing image (AI background removal + auto-tag) and add to wardrobe
// @route   POST /api/wardrobe/analyze
// @access  Private
export const analyzeAndAddItem = async (req, res) => {
  try {
    const { image, name } = req.body;  // image is base64 string

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image (base64)'
      });
    }

    // Convert base64 to buffer and send to AI server as multipart
    const imageBuffer = Buffer.from(image, 'base64');
    const blob = new Blob([imageBuffer], { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', blob, 'clothing.png');

    const aiResponse = await fetch(`${AI_SERVER_URL}/analyze-clothing`, {
      method: 'POST',
      body: formData,
    });

    const aiResult = await aiResponse.json();

    if (aiResult.error) {
      return res.status(500).json({
        success: false,
        message: `AI analysis failed: ${aiResult.error}`
      });
    }

    // Save to wardrobe with AI-detected info
    const itemData = {
      user: req.user.id,
      name: name || `${aiResult.color?.name || ''} ${aiResult.category || 'Item'}`.trim(),
      category: normalizeWardrobeCategory(aiResult.category),
      color: aiResult.color?.name || 'Unknown',
      image: `data:image/png;base64,${aiResult.image_base64}`,
      imageUrl: `data:image/png;base64,${aiResult.image_base64}`,
      source: 'AI',
      tags: [aiResult.color?.name, aiResult.category].filter(Boolean),
    };

    const item = await WardrobeItem.create(itemData);

    res.status(201).json({
      success: true,
      message: 'Item analyzed and added to wardrobe',
      data: item,
      aiAnalysis: {
        color: aiResult.color,
        category: aiResult.category,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

