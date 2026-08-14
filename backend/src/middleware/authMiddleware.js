import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token is missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user details to verify state integrity
    const userRes = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'User session no longer valid.' });
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session token has expired or is invalid.' });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated session.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access forbidden: user role "${req.user.role}" does not satisfy endpoint permissions.` });
    }

    next();
  };
};
