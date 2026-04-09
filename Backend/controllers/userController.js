import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, gender } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (typeof gender === 'string' && ['male', 'female'].includes(gender.trim().toLowerCase())) {
      user.gender = gender.trim().toLowerCase();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { bodyType, stylePersonality, colorPreferences, lifestyle, budget } = req.body;

    const user = await User.findById(req.user.id);

    // Update preferences
    if (bodyType) user.preferences.bodyType = bodyType;
    if (stylePersonality) user.preferences.stylePersonality = stylePersonality;
    if (colorPreferences) user.preferences.colorPreferences = colorPreferences;
    if (lifestyle) user.preferences.lifestyle = lifestyle;
    if (budget) user.preferences.budget = budget;

    user.quizCompleted = true;
    user.lastQuizDate = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
