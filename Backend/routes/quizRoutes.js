import express from 'express';
import {
  submitQuiz,
  getQuizHistory,
  getLatestQuiz,
  getQuizQuestions
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/questions', getQuizQuestions);
router.post('/submit', submitQuiz);
router.get('/history', getQuizHistory);
router.get('/latest', getLatestQuiz);

export default router;
