import express from 'express';
import { chatWithStylist } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, chatWithStylist);

export default router;
