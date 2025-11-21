import express from 'express';
import {
  createExchange,
  getReceivedExchanges,
  getSentExchanges,
  updateExchangeStatus,
  completeExchange
} from '../controllers/exchangeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createExchange);
router.get('/received', authenticateToken, getReceivedExchanges);
router.get('/sent', authenticateToken, getSentExchanges);
router.put('/:id/status', authenticateToken, updateExchangeStatus);
router.put('/:id/complete', authenticateToken, completeExchange);

export default router;
