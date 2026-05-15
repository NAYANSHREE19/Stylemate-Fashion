import express from 'express';
import {
  getWardrobeItems,
  getWardrobeItem,
  addWardrobeItem,
  updateWardrobeItem,
  deleteWardrobeItem,
  toggleFavorite,
  incrementTimesWorn,
  getWardrobeStats,
  analyzeAndAddItem
} from '../controllers/wardrobeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getWardrobeItems);
router.get('/stats', getWardrobeStats);
router.post('/', addWardrobeItem);
router.post('/analyze', analyzeAndAddItem);
router.get('/:id', getWardrobeItem);
router.put('/:id', updateWardrobeItem);
router.delete('/:id', deleteWardrobeItem);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/wear', incrementTimesWorn);

export default router;

