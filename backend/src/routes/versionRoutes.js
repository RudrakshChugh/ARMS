import express from 'express';
import { getVersions } from '../controllers/versionController.js';

const router = express.Router();

router.get('/', getVersions);

export default router;
