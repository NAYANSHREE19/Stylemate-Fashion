import express from 'express';
import {
  getAllStyles,
  getStyle,
  createStyle,
  likeStyle,
  getTrendingStyles,
  saveStyle,
  incrementView,
  addComment,
  getFilterOptions
} from '../controllers/styleGuideController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', protect, getAllStyles);
router.get('/trending', protect, getTrendingStyles);
router.get('/filters', protect, getFilterOptions);
router.get('/:id', protect, getStyle);
router.post('/:id/view', incrementView);

// Protected routes
router.post('/', protect, createStyle);
router.post('/:id/like', protect, likeStyle);
router.post('/:id/save', protect, saveStyle);
router.post('/:id/comment', protect, addComment);

export default router;
