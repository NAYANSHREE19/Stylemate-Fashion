import Outfit from '../models/Outfit.js';
import { resolveUserGender, withGenderFilter } from '../services/genderFilterService.js';

// @desc    Get all style guide items
// @route   GET /api/style-guide
// @access  Public
export const getAllStyles = async (req, res) => {
  try {
    const {
      category,
      search,
      tags,
      season,
      occasion,
      priceRange,
      bodyType,
      difficulty,
      stylePersonality,
      sort = 'popular',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = withGenderFilter({ isPublic: true }, req.user);

    if (category && category !== 'all' && category !== 'All') {
      query.category = category;
    }

    if (season && season !== 'all') {
      query.season = { $in: [season, 'All Season'] };
    }

    if (occasion && occasion !== 'all') {
      query.occasion = occasion;
    }

    if (priceRange && priceRange !== 'all') {
      query.priceRange = priceRange;
    }

    if (bodyType && bodyType !== 'all') {
      query.suitableBodyTypes = { $in: [bodyType, 'All'] };
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    if (stylePersonality && stylePersonality !== 'all') {
      query.stylePersonality = { $in: [stylePersonality] };
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { vibe: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting logic
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likes: -1, saves: -1, views: -1 };
        break;
      case 'trending':
        sortOption = { trending: -1, likes: -1, createdAt: -1 };
        break;
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1, ratingCount: -1 };
        break;
      case 'alphabetical':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { likes: -1, rating: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const styles = await Outfit.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name avatar');

    const total = await Outfit.countDocuments(query);

    res.status(200).json({
      success: true,
      count: styles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: styles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single style
// @route   GET /api/style-guide/:id
// @access  Public
export const getStyle = async (req, res) => {
  try {
    const style = await Outfit.findOne(
      withGenderFilter({ _id: req.params.id, isPublic: true }, req.user)
    ).populate('createdBy', 'name avatar');

    if (!style) {
      return res.status(404).json({
        success: false,
        message: 'Style not found'
      });
    }

    res.status(200).json({
      success: true,
      data: style
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create style (admin/user)
// @route   POST /api/style-guide
// @access  Private
export const createStyle = async (req, res) => {
  try {
    const gender = resolveUserGender(req.user);
    const styleData = {
      ...req.body,
      gender,
      createdBy: req.user.id
    };

    const style = await Outfit.create(styleData);

    res.status(201).json({
      success: true,
      message: 'Style created successfully',
      data: style
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like a style
// @route   POST /api/style-guide/:id/like
// @access  Private
export const likeStyle = async (req, res) => {
  try {
    const style = await Outfit.findById(req.params.id);

    if (!style) {
      return res.status(404).json({
        success: false,
        message: 'Style not found'
      });
    }

    style.likes += 1;
    await style.save();

    res.status(200).json({
      success: true,
      message: 'Style liked',
      data: { likes: style.likes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trending styles
// @route   GET /api/style-guide/trending
// @access  Public
export const getTrendingStyles = async (req, res) => {
  try {
    const styles = await Outfit.find(withGenderFilter({ isPublic: true }, req.user))
      .sort({ likes: -1, rating: -1 })
      .limit(6)
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      count: styles.length,
      data: styles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save/Bookmark a style
// @route   POST /api/style-guide/:id/save
// @access  Private
export const saveStyle = async (req, res) => {
  try {
    const style = await Outfit.findById(req.params.id);

    if (!style) {
      return res.status(404).json({
        success: false,
        message: 'Style not found'
      });
    }

    style.saves += 1;
    await style.save();

    res.status(200).json({
      success: true,
      message: 'Style saved',
      data: { saves: style.saves }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Increment view count
// @route   POST /api/style-guide/:id/view
// @access  Public
export const incrementView = async (req, res) => {
  try {
    const style = await Outfit.findById(req.params.id);

    if (!style) {
      return res.status(404).json({
        success: false,
        message: 'Style not found'
      });
    }

    style.views += 1;
    await style.save();

    res.status(200).json({
      success: true,
      data: { views: style.views }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add comment to style
// @route   POST /api/style-guide/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, rating } = req.body;
    const style = await Outfit.findById(req.params.id);

    if (!style) {
      return res.status(404).json({
        success: false,
        message: 'Style not found'
      });
    }

    const comment = {
      user: req.user.id,
      text,
      rating: rating || null,
      createdAt: new Date()
    };

    style.comments.push(comment);

    // Update avg rating if rating provided
    if (rating) {
      const totalRating = style.comments.reduce((sum, c) => sum + (c.rating || 0), 0);
      style.ratingCount = style.comments.filter(c => c.rating).length;
      style.rating = totalRating / style.ratingCount;
    }

    await style.save();
    await style.populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: style.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get filter options/counts
// @route   GET /api/style-guide/filters
// @access  Public
export const getFilterOptions = async (req, res) => {
  try {
    const baseMatch = withGenderFilter({ isPublic: true }, req.user);
    const [
      categories,
      seasons,
      occasions,
      priceRanges,
      bodyTypes,
      personalities
    ] = await Promise.all([
      Outfit.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Outfit.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$season', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Outfit.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$occasion', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Outfit.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$priceRange', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Outfit.aggregate([
        { $match: baseMatch },
        { $unwind: '$suitableBodyTypes' },
        { $group: { _id: '$suitableBodyTypes', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Outfit.aggregate([
        { $match: baseMatch },
        { $unwind: '$stylePersonality' },
        { $group: { _id: '$stylePersonality', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        categories: categories.map(c => ({ name: c._id, count: c.count })),
        seasons: seasons.map(s => ({ name: s._id, count: s.count })),
        occasions: occasions.map(o => ({ name: o._id, count: o.count })),
        priceRanges: priceRanges.map(p => ({ name: p._id, count: p.count })),
        bodyTypes: bodyTypes.map(b => ({ name: b._id, count: b.count })),
        personalities: personalities.map(p => ({ name: p._id, count: p.count }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
