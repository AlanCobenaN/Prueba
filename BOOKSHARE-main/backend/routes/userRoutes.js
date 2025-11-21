import express from 'express';
import { getAllUsers, getUserById, updateProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/profile', authenticateToken, upload.single('avatar'), updateProfile);

export default router;
