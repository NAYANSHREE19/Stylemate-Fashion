import express from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getFavorites);
router.get('/check/:outfitId', checkFavorite);
router.post('/:outfitId', addFavorite);
router.delete('/:outfitId', removeFavorite);

export default router;
