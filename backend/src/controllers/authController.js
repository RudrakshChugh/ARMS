import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import crypto from 'crypto';

// How long a Google authorization code stays redeemable. The frontend redeems it
// on the very next page load, so this only needs to cover the redirect round trip.
const AUTH_CODE_TTL_MINUTES = 5;

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password fields are required.' });
  }

  try {
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid login email or password.' });
    }

    const user = userRes.rows[0];

    // OAuth-only accounts have no password_hash; bcrypt.compare would throw on null.
    // Answer with the same generic message so the response cannot be used to probe
    // which addresses are registered through Google.
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Invalid login email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error occurred.' });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password fields are required.' });
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check duplicate
    const checkRes = await db.query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (checkRes.rows.length > 0) {
      return res.status(409).json({ error: 'Email address has already been registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Never accept a role from an unauthenticated public endpoint: always default to 'user'.
    // Admin/Instructor privileges must be granted by an existing admin, not self-asserted.
    const targetRole = 'user';

    const insertRes = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name.trim(), trimmedEmail, passwordHash, targetRole]
    );

    const newUser = insertRes.rows[0];
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error occurred.' });
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// 1. Redirect to Google Consent Screen
export const redirectToGoogle = (req, res) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;
  const scope = 'openid email profile';
  
  if (!clientID || !callbackURL) {
    console.error('Google OAuth credentials missing on backend.');
    return res.status(500).json({ error: 'Google OAuth configuration is incomplete.' });
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${encodeURIComponent(clientID)}` +
    `&redirect_uri=${encodeURIComponent(callbackURL)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&prompt=consent` +
    `&access_type=offline`;
    
  res.redirect(url);
};

// 2. Google OAuth Callback (Code Exchange & User Lookup/Creation)
export const googleCallback = async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  if (!code) {
    return res.redirect(`${frontendUrl}/admin/login?error=Missing+authorization+code`);
  }

  try {
    let email, name, googleId;

    if (process.env.NODE_ENV === 'test') {
      // Mock authorization code mappings for automated testing
      if (code === 'mock-admin-code') {
        email = 'admin@workspace.edu';
        name = 'Manya Kedia';
        googleId = 'google-admin-123';
      } else if (code === 'mock-instructor-code') {
        email = 'instructor@workspace.edu';
        name = 'Instructor Profile';
        googleId = 'google-inst-123';
      } else if (code === 'mock-new-code') {
        email = 'new@gmail.com';
        name = 'New User';
        googleId = 'google-new-123';
      } else if (code === 'mock-existing-user-code') {
        email = 'student@workspace.edu';
        name = 'Aarav Sharma';
        googleId = 'google-user-123';
      } else {
        return res.redirect(`${frontendUrl}/admin/login?error=Invalid+Google+identity`);
      }
    } else {
      // Exchange code for token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenRes.ok) {
        console.error('Google Token Exchange Failure:', await tokenRes.text());
        return res.redirect(`${frontendUrl}/admin/login?error=Google+token+exchange+failed`);
      }

      const tokenData = await tokenRes.json();
      const idToken = tokenData.id_token;

      // Verify Google ID Token
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!verifyRes.ok) {
        console.error('Google ID Verification Failure:', await verifyRes.text());
        return res.redirect(`${frontendUrl}/admin/login?error=Google+token+verification+failed`);
      }

      const payload = await verifyRes.json();
      email = payload.email?.toLowerCase().trim();
      name = payload.name;
      googleId = payload.sub;
    }

    if (!email) {
      return res.redirect(`${frontendUrl}/admin/login?error=Google+email+claim+missing`);
    }

    // Lookup user in PostgreSQL
    // 1. Try mapping by google_id
    let userRes = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = userRes.rows[0];

    if (!user) {
      // 2. Fallback to mapping by email for account linking
      userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      user = userRes.rows[0];

      if (user) {
        // Link google_id without altering their existing database-controlled role
        await db.query(
          'UPDATE users SET google_id = $1, auth_provider = $2 WHERE id = $3',
          [googleId, 'google', user.id]
        );
        user.google_id = googleId;
        user.auth_provider = 'google';
      } else {
        // Create new account (automatically receives default role 'user')
        const insertRes = await db.query(
          `INSERT INTO users (name, email, google_id, auth_provider, role) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [name || 'Google User', email, googleId, 'google', 'user']
        );
        user = insertRes.rows[0];
      }
    }

    // Generate application session JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Save temporary short-lived single-use authorization code.
    // created_at is left to the column default so it is stamped by the database
    // clock, which is the same clock the expiry check in exchangeToken reads.
    const authCode = crypto.randomUUID();
    await db.query(
      'INSERT INTO auth_codes (code, jwt) VALUES ($1, $2)',
      [authCode, token]
    );

    // Redirect to frontend callback page with authorization code
    res.redirect(`${frontendUrl}/admin/login/callback?code=${authCode}`);
  } catch (err) {
    console.error('Google auth callback error:', err);
    res.redirect(`${frontendUrl}/admin/login?error=Authentication+handshake+failed`);
  }
};

// 3. Exchange short-lived authorization code for JWT
export const exchangeToken = async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required.' });
  }

  try {
    // Drop anything past its lifetime first, so abandoned handshakes cannot pile
    // up in the table indefinitely holding usable session tokens.
    await db.query(
      'DELETE FROM auth_codes WHERE created_at < NOW() - make_interval(mins => $1)',
      [AUTH_CODE_TTL_MINUTES]
    );

    // Retrieve and immediately delete to enforce single-use constraint
    const codeRes = await db.query('DELETE FROM auth_codes WHERE code = $1 RETURNING jwt', [code]);
    const row = codeRes.rows[0];

    if (!row) {
      return res.status(400).json({ error: 'Authorization code is invalid, expired, or has already been used.' });
    }

    res.json({ token: row.jwt });
  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Internal server error occurred.' });
  }
};
