import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import jwt from 'jsonwebtoken';

describe('Backend Authentication API Tests', () => {
  // 1. Valid Admin Login
  it('should authenticate a valid admin account and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@workspace.edu', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.role).toBe('admin');
    expect(res.body.user.name).toBe('Manya Kedia');

    // Verify JWT structure
    const decoded = jwt.decode(res.body.token);
    expect(decoded).toHaveProperty('id');
    expect(decoded.role).toBe('admin');
  });

  // 2. Valid Instructor Login
  it('should authenticate a valid instructor account and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'instructor@workspace.edu', password: 'inst123' });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('instructor');
  });

  // 3. Valid Student Login
  it('should authenticate a valid student account and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@workspace.edu', password: 'student123' });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('user');
  });

  // 4. Incorrect Password
  it('should reject login request with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@workspace.edu', password: 'wrong_password' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Invalid login email or password.');
  });

  // 5. Nonexistent Email
  it('should reject login request with nonexistent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@workspace.edu', password: 'admin123' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid login email or password.');
  });

  // 6. Missing Email
  it('should reject login request with missing email parameter', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'admin123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Email and password fields are required.');
  });

  // 7. Missing Password
  it('should reject login request with missing password parameter', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@workspace.edu' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Email and password fields are required.');
  });

  // 8. Malformed Login Request
  it('should reject login request with malformed body payload', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('malformed json string{');

    expect(res.status).toBe(400);
  });

  // 9. Expired / Invalid Token Rejection on a Protected Endpoint
  it('should reject requests with invalid JWT tokens on protected endpoints', async () => {
    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', 'Bearer invalid_token_bytes_xyz')
      .send({ title: 'v1.3', version: 'v1.3', stageName: 'v1.3', changeSummary: 'notes' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Session token has expired or is invalid.');
  });
});
