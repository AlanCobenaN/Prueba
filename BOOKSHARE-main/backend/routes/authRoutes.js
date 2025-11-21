import express from 'express';
import { register, login, getProfile, verifyEmail, resendVerificationEmail, deleteAccount } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.delete('/delete-account', authenticateToken, deleteAccount);

export default router;
