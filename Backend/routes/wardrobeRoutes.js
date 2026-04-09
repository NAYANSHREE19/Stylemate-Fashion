import express from 'express';
import {
  getWardrobeItems,
  getWardrobeItem,
  addWardrobeItem,
  updateWardrobeItem,
  deleteWardrobeItem,
  toggleFavorite,
  incrementTimesWorn,
  getWardrobeStats
} from '../controllers/wardrobeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getWardrobeItems);
router.get('/stats', getWardrobeStats);
router.get('/:id', getWardrobeItem);
router.post('/', addWardrobeItem);
router.put('/:id', updateWardrobeItem);
router.delete('/:id', deleteWardrobeItem);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/wear', incrementTimesWorn);

export default router;
