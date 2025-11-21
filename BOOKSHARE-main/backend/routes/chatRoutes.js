import express from 'express';
import { sendMessage, getConversation, getConversations } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', authenticateToken, sendMessage);
router.get('/conversations', authenticateToken, getConversations);
router.get('/:userId', authenticateToken, getConversation);

export default router;
