import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import { generateRecommendations } from '../utils/recommendationEngine.js';
import { getGenderedQuizQuestions } from '../services/quizQuestionService.js';

// Open-ended validation — any non-empty string is accepted.
// This makes the quiz future-proof without backend schema changes.
const QUIZ_ENUMS = null; // validation is done by isValidValue() below

const isValidValue  = (v) => typeof v === 'string' && v.trim().length > 0;
const isValidArray  = (arr) => Array.isArray(arr) && arr.length > 0 && arr.every(isValidValue);


const normalizeText = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, ' ') : '';

// Pass-through normalizer — no strict mapping needed anymore
const normalizeQuizPayload = (payload = {}) => {
  const toArray = (v) =>
    Array.isArray(v) ? v.filter(isValidValue) : (isValidValue(v) ? [v] : []);

  return {
    lifestyle        : (payload.lifestyle || '').trim(),
    stylePersonality : toArray(payload.stylePersonality),
    colorPreferences : toArray(payload.colorPreferences),
    bodyType         : (payload.bodyType || '').trim(),
    budget           : (payload.budget  || '').trim(),
    // extra fields from expanded quiz
    occasion         : (payload.occasion || '').trim(),
    mood             : toArray(payload.mood),
    season           : (payload.season  || '').trim(),
  };
};

const validateNormalizedPayload = (payload) => {
  const invalid = [];
  if (!isValidValue(payload.lifestyle))        invalid.push('lifestyle');
  if (!isValidArray(payload.stylePersonality)) invalid.push('stylePersonality');
  if (!isValidValue(payload.bodyType))         invalid.push('bodyType');
  if (!isValidValue(payload.budget))           invalid.push('budget');
  return invalid;
};

// @desc    Get quiz questions based on user gender
// @route   GET /api/quiz/questions
// @access  Private
export const getQuizQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('gender');

    const questions = getGenderedQuizQuestions(user);

    return res.status(200).json({
      success: true,
      data: {
        gender: user?.gender || null,
        questions
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Submit quiz results
// @route   POST /api/quiz/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const normalizedPayload = normalizeQuizPayload(req.body);
    const {
      lifestyle, stylePersonality, colorPreferences,
      bodyType, budget, occasion, mood, season
    } = normalizedPayload;

    const invalid = validateNormalizedPayload(normalizedPayload);

    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required quiz fields: ${invalid.join(', ')}`
      });
    }

    // Build richer style DNA using all expanded fields
    const styleDNA = generateStyleDNA({
      lifestyle, stylePersonality, colorPreferences,
      bodyType, budget, occasion, mood, season
    });

    // Generate recommendations (existing engine)
    const recommendations = generateRecommendations({
      lifestyle,
      stylePersonality,
      colorPreferences,
      bodyType,
      budget
    });

    // Save quiz result — store all new fields in answers
    const quizResult = await QuizResult.create({
      user: req.user.id,
      answers: {
        lifestyle,
        stylePersonality,
        colorPreferences,
        bodyType,
        budget,
        occasion,
        mood,
        season
      },
      styleDNA,
      recommendations
    });

    // Update user preferences
    const user = await User.findById(req.user.id);
    user.preferences = {
      lifestyle,
      stylePersonality,
      colorPreferences,
      bodyType,
      budget,
      occasion,
      mood,
      season
    };
    user.quizCompleted = true;
    user.lastQuizDate = Date.now();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        styleDNA,
        recommendations,
        quizId: quizResult._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
export const getQuizHistory = async (req, res) => {
  try {
    const quizResults = await QuizResult.find({ user: req.user.id })
      .sort({ completedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: quizResults.length,
      data: quizResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get latest quiz result
// @route   GET /api/quiz/latest
// @access  Private
export const getLatestQuiz = async (req, res) => {
  try {
    const latestQuiz = await QuizResult.findOne({ user: req.user.id })
      .sort({ completedAt: -1 });

    if (!latestQuiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz results found'
      });
    }

    res.status(200).json({
      success: true,
      data: latestQuiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to generate style DNA
function generateStyleDNA({ lifestyle, stylePersonality, colorPreferences, bodyType, budget, occasion, mood, season }) {
  const styles  = Array.isArray(stylePersonality) ? stylePersonality.join(' + ') : stylePersonality || '';
  const colors  = Array.isArray(colorPreferences) ? colorPreferences.slice(0, 2).join(' & ') : colorPreferences || '';
  const moods   = Array.isArray(mood) ? mood.join(', ') : mood || '';

  const parts = [`${lifestyle} ${styles} lover`];
  if (colors)   parts.push(`who rocks ${colors} tones`);
  if (bodyType) parts.push(`with ${bodyType} silhouettes`);
  if (budget)   parts.push(`on a ${budget} budget`);
  if (occasion) parts.push(`— perfect for ${occasion}`);
  if (moods)    parts.push(`with a ${moods} vibe`);
  if (season)   parts.push(`in ${season} weather`);

  return parts.join(' ');
}
