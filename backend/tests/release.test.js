import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/config/db.js';

describe('Backend Release Control & Transactions API Tests', () => {
  // Helper to log in as a specific role
  const getAuthToken = async (email, password) => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    return res.body.token;
  };

  // 1. Authorization Access Tests
  it('should restrict release publication to Admin role only', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const instToken = await getAuthToken('instructor@workspace.edu', 'inst123');
    const studToken = await getAuthToken('student@workspace.edu', 'student123');

    const validPayload = {
      title: 'Valid Planning v1.3',
      version: 'v1.3',
      author: 'Admin Mocked',
      stageName: 'Planning V3',
      changeSummary: 'Release changelog summary description.',
      assets: []
    };

    // Instructor -> 403 Forbidden
    const instRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${instToken}`)
      .send(validPayload);
    expect(instRes.status).toBe(403);

    // Student -> 403 Forbidden
    const studRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${studToken}`)
      .send(validPayload);
    expect(studRes.status).toBe(403);

    // Unauthenticated -> 401 Unauthorized
    const unauthRes = await request(app)
      .post('/api/releases')
      .send(validPayload);
    expect(unauthRes.status).toBe(401);

    // Admin -> 201 Created
    const adminRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validPayload);
    expect(adminRes.status).toBe(201);
    expect(adminRes.body).toHaveProperty('success', true);
  });

  // 2. Payload Validation Tests
  it('should validate all required fields and prevent duplicates', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');

    // Missing stageName
    const missingStageNameRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Missing Stage',
        version: 'v1.4',
        author: 'Admin',
        changeSummary: 'Summary notes.'
      });
    expect(missingStageNameRes.status).toBe(400);
    expect(missingStageNameRes.body.error).toContain('All fields');

    // Duplicate version
    const duplicateVersionRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Duplicate Version',
        version: 'v1.3', // Already published in previous test case!
        author: 'Admin',
        stageName: 'Planning V4',
        changeSummary: 'Summary notes.'
      });
    expect(duplicateVersionRes.status).toBe(409);
    expect(duplicateVersionRes.body.error).toContain('already been published');

    // Duplicate stage name (case-insensitive & trimmed)
    const duplicateStageRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Duplicate Stage Name',
        version: 'v1.5',
        author: 'Admin',
        stageName: 'planning v3', // Already exists as 'Planning V3'!
        changeSummary: 'Summary notes.'
      });
    expect(duplicateStageRes.status).toBe(400);
    expect(duplicateStageRes.body.error).toContain('already exists');
  });

  // 3. Successful Release Transactional Commit Check
  it('should atomically create publication, version, activity, and stages records together', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const versionTag = 'v1.6';
    const newStage = 'Planning V6';

    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Atomic Publication Test',
        version: versionTag,
        author: 'Admin',
        stageName: newStage,
        changeSummary: 'Verification of transaction operations.'
      });

    expect(res.status).toBe(201);

    // Verify all records exist in PostgreSQL
    const pubCheck = await db.query('SELECT * FROM publications WHERE version = $1', [versionTag]);
    const verCheck = await db.query('SELECT * FROM project_versions WHERE version = $1', [versionTag]);
    const actCheck = await db.query('SELECT * FROM activities WHERE version = $1', [versionTag]);
    const stageCheck = await db.query('SELECT * FROM stages WHERE name = $1', [newStage]);

    expect(pubCheck.rows.length).toBe(1);
    expect(verCheck.rows.length).toBe(1);
    expect(actCheck.rows.length).toBe(1);
    expect(stageCheck.rows.length).toBe(1);
  });

  // 4. Release Transaction Rollback Check under deliberate DB failure
  it('should roll back the entire transaction if any insert fails', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const versionTag = 'v1.99';
    const newStage = 'Rollback Stage';

    // Simulate database failure by trying to insert staged assets with missing properties (path is null)
    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Rollback Test Publication',
        version: versionTag,
        author: 'Admin',
        stageName: newStage,
        changeSummary: 'Simulating failure for transaction verification.',
        assets: [
          { name: 'corrupt.pdf', type: 'pdf', size: '1.2 MB', path: null } // path = null violates publication_files NOT NULL constraint!
        ]
      });

    expect(res.status).toBe(500); // DB failure results in transaction rollback error!

    // Verify that NO partial records exist in the database for this version/stage
    const pubCheck = await db.query('SELECT * FROM publications WHERE version = $1', [versionTag]);
    const verCheck = await db.query('SELECT * FROM project_versions WHERE version = $1', [versionTag]);
    const actCheck = await db.query('SELECT * FROM activities WHERE version = $1', [versionTag]);
    const stageCheck = await db.query('SELECT * FROM stages WHERE name = $1', [newStage]);

    expect(pubCheck.rows.length).toBe(0);
    expect(verCheck.rows.length).toBe(0);
    expect(actCheck.rows.length).toBe(0);
    expect(stageCheck.rows.length).toBe(0);
  });
});
