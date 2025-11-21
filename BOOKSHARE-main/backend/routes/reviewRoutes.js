import express from 'express';
import { createReview, getUserReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/user/:userId', authenticateToken, getUserReviews);

export default router;
