import express from 'express';
import { getProjects, getResponsibilityMatrix, getTeamMembers } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/matrix', getResponsibilityMatrix);
router.get('/team', getTeamMembers);

export default router;
