import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/config/db.js';

describe('Backend Release Deletion & Transactional Integrity Tests', () => {
  const getAuthToken = async (email, password) => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    return res.body.token;
  };

  it('should verify authorization rules and cascade delete publication records', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const instToken = await getAuthToken('instructor@workspace.edu', 'inst123');
    const studToken = await getAuthToken('student@workspace.edu', 'student123');

    // 1. Create a dummy release to delete
    const versionTag = 'v9.9';
    const stageName = 'Delete Testing Stage';

    const publishRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Delete Testing Publication',
        version: versionTag,
        author: 'Admin',
        stageName: stageName,
        changeSummary: 'Testing release deletion cascade constraints.'
      });

    expect(publishRes.status).toBe(201);
    
    // Look up publication ID by versionTag since creation API returns success/stageId
    const pubQuery = await db.query('SELECT id FROM publications WHERE version = $1', [versionTag]);
    const pubId = pubQuery.rows[0]?.id;
    expect(pubId).toBeDefined();

    // Verify records exist in database
    const pubCheck1 = await db.query('SELECT * FROM publications WHERE id = $1', [pubId]);
    const verCheck1 = await db.query('SELECT * FROM project_versions WHERE version = $1', [versionTag]);
    const stageCheck1 = await db.query('SELECT * FROM stages WHERE name = $1', [stageName]);
    expect(pubCheck1.rows.length).toBe(1);
    expect(verCheck1.rows.length).toBe(1);
    expect(stageCheck1.rows.length).toBe(1);

    // 2. Test Authorization restrictions on DELETE /api/releases/:id
    // Student -> 403 Forbidden
    const studDelRes = await request(app)
      .delete(`/api/releases/${pubId}`)
      .set('Authorization', `Bearer ${studToken}`);
    expect(studDelRes.status).toBe(403);

    // Instructor -> 403 Forbidden
    const instDelRes = await request(app)
      .delete(`/api/releases/${pubId}`)
      .set('Authorization', `Bearer ${instToken}`);
    expect(instDelRes.status).toBe(403);

    // Unauthenticated -> 401 Unauthorized
    const unauthDelRes = await request(app)
      .delete(`/api/releases/${pubId}`);
    expect(unauthDelRes.status).toBe(401);

    // Verify records STILL exist
    const pubCheck2 = await db.query('SELECT * FROM publications WHERE id = $1', [pubId]);
    expect(pubCheck2.rows.length).toBe(1);

    // 3. Admin deletes the publication -> 200 Success
    const adminDelRes = await request(app)
      .delete(`/api/releases/${pubId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminDelRes.status).toBe(200);

    // Verify all publication-owned records are cascaded and deleted
    const pubCheck3 = await db.query('SELECT * FROM publications WHERE id = $1', [pubId]);
    const verCheck3 = await db.query('SELECT * FROM project_versions WHERE version = $1', [versionTag]);
    const stageCheck3 = await db.query('SELECT * FROM stages WHERE name = $1', [stageName]);

    expect(pubCheck3.rows.length).toBe(0);
    expect(verCheck3.rows.length).toBe(0);
    expect(stageCheck3.rows.length).toBe(0);

    // 4. Verify seed data is not affected
    const seedStageCheck = await db.query("SELECT * FROM stages WHERE id = 'stage-1'");
    expect(seedStageCheck.rows.length).toBe(1);

    // 5. Nonexistent release -> 404
    const nonexistentDelRes = await request(app)
      .delete('/api/releases/999999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(nonexistentDelRes.status).toBe(404);
  });
});
