import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/config/db.js';

describe('Backend Project Journey Stages API Tests', () => {
  const getAuthToken = async (email, password) => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    return res.body.token;
  };

  // 1. Newly created stages status check
  it('should initialize stages status strictly to In Progress and reject Planned', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    
    // Create new stage
    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Status Spec Stage',
        version: 'v1.7',
        author: 'Admin',
        stageName: 'Planning V7',
        changeSummary: 'Status check tests.'
      });
      
    expect(res.status).toBe(201);

    // Query DB stage status
    const stageRes = await db.query("SELECT * FROM stages WHERE name = 'Planning V7'");
    expect(stageRes.rows.length).toBe(1);
    expect(stageRes.rows[0].status).toBe('In Progress');
    
    // Verify no planned status is in database
    const plannedCheck = await db.query("SELECT * FROM stages WHERE status = 'Planned'");
    expect(plannedCheck.rows.length).toBe(0);
  });

  // 2. Stage completion API access controls
  it('should restrict PATCH /api/stages/:id/complete to authorized admin accounts only', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const instToken = await getAuthToken('instructor@workspace.edu', 'inst123');
    const studToken = await getAuthToken('student@workspace.edu', 'student123');

    const stageId = 'stage-4'; // seeded as 'In Progress'

    // Student -> 403 Forbidden
    const studRes = await request(app)
      .patch(`/api/stages/${stageId}/complete`)
      .set('Authorization', `Bearer ${studToken}`);
    expect(studRes.status).toBe(403);

    // Instructor -> 403 Forbidden
    const instRes = await request(app)
      .patch(`/api/stages/${stageId}/complete`)
      .set('Authorization', `Bearer ${instToken}`);
    expect(instRes.status).toBe(403);

    // Unauthenticated -> 401 Unauthorized
    const unauthRes = await request(app)
      .patch(`/api/stages/${stageId}/complete`);
    expect(unauthRes.status).toBe(401);

    // Nonexistent stage -> 404 Not Found
    const nonexistentRes = await request(app)
      .patch('/api/stages/stage-nonexistent/complete')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(nonexistentRes.status).toBe(404);

    // Admin -> 200 Success
    const adminRes = await request(app)
      .patch(`/api/stages/${stageId}/complete`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.status).toBe('Completed');

    // Verify database query preserves status
    const dbCheck = await db.query('SELECT status FROM stages WHERE id = $1', [stageId]);
    expect(dbCheck.rows[0].status).toBe('Completed');
  });
});
