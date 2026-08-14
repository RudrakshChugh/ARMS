import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../config/db.js';
import storageService from '../services/storage/index.js';

// Ensure the local uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage setup for initial staged upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe filename prefixing with timestamp
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

// Configure Multer rules (50MB size constraint)
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.svg', '.mp4', '.md', '.markdown'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error(`File type rejected. Allowed types: ${allowedExtensions.join(', ')}`));
    }
    cb(null, true);
  }
});

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No staged file detected.' });
  }

  try {
    // Pipe the local Multer-uploaded file through the active storage service
    const storagePath = await storageService.uploadFile(
      req.file.path,
      req.file.filename,
      req.file.mimetype
    );

    res.status(201).json({
      success: true,
      file: {
        name: req.file.originalname,
        filename: req.file.filename,
        size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: req.file.originalname.split('.').pop() || 'pdf',
        path: storagePath
      }
    });
  } catch (err) {
    console.error('File upload staging failed:', err);
    res.status(500).json({ error: 'Failed to stage and upload the deliverable file.' });
  }
};

export const getFile = async (req, res) => {
  const { id } = req.params;

  try {
    // Query database for matching metadata row
    const fileRes = await db.query('SELECT * FROM publication_files WHERE id = $1', [id]);
    if (fileRes.rows.length === 0) {
      return res.status(404).json({ error: 'File deliverable not found.' });
    }

    const file = fileRes.rows[0];
    
    // Obtain short-lived signed URL or relative path from the active storage service
    const url = await storageService.getFileUrl(file.path);

    // Redirect to download/view the deliverable securely
    res.redirect(url);
  } catch (err) {
    console.error('Retrieving file URL failed:', err);
    res.status(500).json({ error: 'Failed to load file deliverable signed URL.' });
  }
};
