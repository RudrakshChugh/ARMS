import express from 'express';
import multer from 'multer';
import { upload, uploadFile, getFile } from '../controllers/fileController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer rejections (bad extension, oversized file) are client mistakes, but they
// reach the app as plain errors with no status, so the global boundary would turn
// them into an opaque 500. Translate them into actionable 4xx responses instead.
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File exceeds the 50 MB upload limit.' });
      }
      return res.status(400).json({ error: `Upload rejected: ${err.message}` });
    }

    // fileFilter rejections arrive as ordinary Errors carrying a safe message
    return res.status(400).json({ error: err.message || 'Upload rejected.' });
  });
};

// Staging endpoints upload files, checking user session first (Admin only)
router.post('/upload', requireAuth, requireRole(['admin']), handleUpload, uploadFile);

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
