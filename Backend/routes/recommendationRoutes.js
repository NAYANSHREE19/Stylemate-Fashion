import express from 'express';
import {
  getRecommendations,
  getRecommendationsByOccasion,
  getRecommendationsByCategory,
  getOutfit,
  submitRecommendationFeedback
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getRecommendations);
router.get('/occasion/:occasion', protect, getRecommendationsByOccasion);
router.get('/category/:category', protect, getRecommendationsByCategory);
router.post('/feedback', protect, submitRecommendationFeedback);
router.get('/:id', getOutfit);

export default router;
