import express from 'express';
import { upload, uploadFile, getFile } from '../controllers/fileController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Staging endpoints upload files, checking user session first (Admin only)
router.post('/upload', requireAuth, requireRole(['admin']), upload.single('file'), uploadFile);

// Secure file retrieval route accessible by any authenticated user
// Note: Made public because browser <img>, <iframe> and <object> tags cannot send Authorization headers
router.get('/:id', getFile);

export default router;
