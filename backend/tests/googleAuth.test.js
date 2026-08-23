import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/config/db.js';
import jwt from 'jsonwebtoken';

describe('Google Authentication & Database Roles API Tests', () => {
  beforeEach(async () => {
    // Clean up auth codes and any newly registered test users to keep test runs isolated
    await db.query('DELETE FROM auth_codes');
    await db.query("DELETE FROM users WHERE email = 'new@gmail.com'");
    // Make sure aarav matches role 'user'
    await db.query("UPDATE users SET google_id = NULL, auth_provider = 'local', role = 'user' WHERE email = 'student@workspace.edu'");
  });

  const exchangeOAuthCode = async (mockCode) => {
    // 1. Hit the backend callback to get a secure application handoff authCode
    const callbackRes = await request(app)
      .get(`/api/auth/google/callback?code=${mockCode}`);
    
    expect(callbackRes.status).toBe(302);
    const redirectUrl = callbackRes.headers.location;
    const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
    const authCode = urlParams.get('code');
    
    expect(authCode).toBeDefined();

    // 2. Exchange the short-lived authCode for the actual application JWT
    const tokenRes = await request(app)
      .post('/api/auth/google/token')
      .send({ code: authCode });
    
    expect(tokenRes.status).toBe(200);
    expect(tokenRes.body).toHaveProperty('token');
    return tokenRes.body.token;
  };

  // 1. New Google user -> created with default role 'user'
  it('should register a first-time Google identity with default role user', async () => {
    const token = await exchangeOAuthCode('mock-new-code');
    
    // Call GET /me to verify role
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('new@gmail.com');
    expect(meRes.body.user.role).toBe('user');
  });

  // 2. Google account linking preserves existing role - admin remains admin
  it('should link verified Google identity to matching existing admin email and preserve admin role', async () => {
    const token = await exchangeOAuthCode('mock-admin-code');
    
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('admin@workspace.edu');
    expect(meRes.body.user.role).toBe('admin');
  });

  // 3. Google account linking preserves existing role - instructor remains instructor
  it('should link verified Google identity to matching existing instructor email and preserve instructor role', async () => {
    const token = await exchangeOAuthCode('mock-instructor-code');
    
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('instructor@workspace.edu');
    expect(meRes.body.user.role).toBe('instructor');
  });

  // 4. Google account linking preserves existing role - user remains user
  it('should link verified Google identity to matching existing user email and preserve user role', async () => {
    const token = await exchangeOAuthCode('mock-existing-user-code');
    
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('student@workspace.edu');
    expect(meRes.body.user.role).toBe('user');
  });

  // 5. Client cannot assign custom role during signup
  it('should ignore client-supplied roles and restrict creation to user role', async () => {
    // Attempt to bypass by appending role=admin to callback query parameters
    const callbackRes = await request(app)
      .get('/api/auth/google/callback?code=mock-new-code&role=admin');
    
    expect(callbackRes.status).toBe(302);
    const redirectUrl = callbackRes.headers.location;
    const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
    const authCode = urlParams.get('code');

    const tokenRes = await request(app)
      .post('/api/auth/google/token')
      .send({ code: authCode, role: 'admin' }); // pass in exchange body
    
    const token = tokenRes.body.token;
    
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('new@gmail.com');
    expect(meRes.body.user.role).toBe('user'); // must strictly remain 'user'!
  });

  // 6. Invalid Google token is rejected
  it('should reject unverified Google identities and redirect to login screen with error', async () => {
    const callbackRes = await request(app)
      .get('/api/auth/google/callback?code=invalid-oauth-code');
    
    expect(callbackRes.status).toBe(302);
    expect(callbackRes.headers.location).toContain('/admin/login?error=');
  });

  // 7. Invalid short-lived codes are rejected
  it('should reject invalid or reused short-lived authorization codes', async () => {
    // Exchange once (valid)
    const callbackRes = await request(app)
      .get('/api/auth/google/callback?code=mock-new-code');
    
    const redirectUrl = callbackRes.headers.location;
    const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
    const authCode = urlParams.get('code');

    // Attempt first exchange (success)
    const tokenRes1 = await request(app)
      .post('/api/auth/google/token')
      .send({ code: authCode });
    expect(tokenRes1.status).toBe(200);

    // Attempt second exchange (must fail because it is single-use!)
    const tokenRes2 = await request(app)
      .post('/api/auth/google/token')
      .send({ code: authCode });
    expect(tokenRes2.status).toBe(400);
    expect(tokenRes2.body.error).toContain('already been used');
  });

  // 7.1 Codes past their TTL are rejected and purged
  it('should reject and purge short-lived authorization codes past their TTL', async () => {
    const callbackRes = await request(app)
      .get('/api/auth/google/callback?code=mock-new-code');

    const urlParams = new URLSearchParams(callbackRes.headers.location.split('?')[1]);
    const authCode = urlParams.get('code');

    // Age the code well beyond the 5 minute redemption window
    await db.query("UPDATE auth_codes SET created_at = NOW() - INTERVAL '10 minutes' WHERE code = $1", [authCode]);

    const tokenRes = await request(app)
      .post('/api/auth/google/token')
      .send({ code: authCode });

    expect(tokenRes.status).toBe(400);
    expect(tokenRes.body.error).toContain('expired');

    // The stale row must be gone, not merely refused
    const remaining = await db.query('SELECT code FROM auth_codes WHERE code = $1', [authCode]);
    expect(remaining.rows.length).toBe(0);
  });

  // 8. Role Authorization Rules - Admin can access admin endpoint
  it('should allow admin role to access admin-only endpoints', async () => {
    const adminToken = await exchangeOAuthCode('mock-admin-code');
    
    const validPayload = {
      title: 'OAuth Test Release',
      version: 'v9.8',
      author: 'Admin',
      stageName: 'Google Integration Stage',
      changeSummary: 'Admin permissions validation.'
    };

    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validPayload);
    
    expect(res.status).toBe(201);
  });

  // 9. Role Authorization Rules - Instructor receives 403
  it('should block instructor role from accessing admin-only endpoints with 403', async () => {
    const instToken = await exchangeOAuthCode('mock-instructor-code');
    
    const validPayload = {
      title: 'OAuth Hack Release',
      version: 'v9.9',
      author: 'Instructor',
      stageName: 'Hacked Stage',
      changeSummary: 'Testing security restrictions.'
    };

    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${instToken}`)
      .send(validPayload);
    
    expect(res.status).toBe(403);
  });

  // 10. Role Authorization Rules - User receives 403
  it('should block user role from accessing admin-only endpoints with 403', async () => {
    const userToken = await exchangeOAuthCode('mock-new-code');
    
    const validPayload = {
      title: 'OAuth User Hack Release',
      version: 'v9.10',
      author: 'User',
      stageName: 'User Hack Stage',
      changeSummary: 'Testing security restrictions.'
    };

    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validPayload);
    
    expect(res.status).toBe(403);
  });

  // 11. Role Authorization Rules - Unauthenticated request receives 401
  it('should block unauthenticated sessions with 401', async () => {
    const res = await request(app)
      .post('/api/releases')
      .send({
        title: 'Unauth Release',
        version: 'v0.0',
        author: 'Ghost',
        stageName: 'Ghost Stage',
        changeSummary: 'Should fail.'
      });
    
    expect(res.status).toBe(401);
  });
});
