import express from 'express';
import { generateAIOutfits, remixOutfit } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-outfits', protect, generateAIOutfits);
router.post('/remix-outfit', protect, remixOutfit);

export default router;
