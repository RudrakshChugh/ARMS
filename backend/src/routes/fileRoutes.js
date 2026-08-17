import express from 'express';
import { upload, uploadFile, getFile } from '../controllers/fileController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Staging endpoints upload files, checking user session first (Admin only)
router.post('/upload', requireAuth, requireRole(['admin']), upload.single('file'), uploadFile);

// Secure file retrieval route accessible by any authenticated user
// Note: Made public because browser <img>, <iframe> and <object> tags cannot send Authorization headers
router.get('/:id', getFile);

// Delete file endpoint to remove orphaned files from storage when user removes them from the staging UI
router.delete('/:path(*)', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { path } = req.params;
    const { default: storageService } = await import('../services/storage/index.js');
    await storageService.deleteFile(path);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete physical file from storage', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
