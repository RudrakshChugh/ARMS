import express from 'express';
import { login, register, getMe, redirectToGoogle, googleCallback, exchangeToken } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', requireAuth, getMe);

// Google OAuth 2.0 / OpenID Connect routes
router.get('/google', redirectToGoogle);
router.get('/google/callback', googleCallback);
router.post('/google/token', exchangeToken);

export default router;
