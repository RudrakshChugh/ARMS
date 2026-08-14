import express from 'express';
import { publishRelease, getPublications, deleteRelease } from '../controllers/releaseController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublications);
router.post('/', requireAuth, requireRole(['admin']), publishRelease);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteRelease);

export default router;
