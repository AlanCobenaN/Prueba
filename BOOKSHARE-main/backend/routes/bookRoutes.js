import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  getMyBooks,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('foto'), handleMulterError, createBook);
router.get('/', authenticateToken, getAllBooks);
router.get('/my-books', authenticateToken, getMyBooks);
router.get('/:id', authenticateToken, getBookById);
router.put('/:id', authenticateToken, upload.single('foto'), handleMulterError, updateBook);
router.delete('/:id', authenticateToken, deleteBook);

export default router;
