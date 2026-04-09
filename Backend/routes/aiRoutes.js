import express from 'express';
import { generateAIOutfits } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-outfits', protect, generateAIOutfits);

export default router;
