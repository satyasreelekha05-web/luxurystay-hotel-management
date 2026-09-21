import express from 'express';
import { chatWithAssistant, getAIRecommendations, getReviewSummary } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithAssistant);
router.post('/recommend', getAIRecommendations);
router.post('/review-summary', getReviewSummary);

export default router;
