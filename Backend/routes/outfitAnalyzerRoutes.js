import express from 'express';
import { analyzeOutfit } from '../controllers/outfitAnalyzerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/outfit-analyzer/analyze
router.post('/analyze', protect, analyzeOutfit);

export default router;
