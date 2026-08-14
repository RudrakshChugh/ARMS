import express from 'express';
import { getStages, getStageById, markStageComplete } from '../controllers/stageController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getStages);
router.get('/:id', getStageById);
router.patch('/:id/complete', requireAuth, requireRole(['admin']), markStageComplete);

export default router;
