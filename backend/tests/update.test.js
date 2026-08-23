import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/config/db.js';

describe('Backend Release Edit & Transactional Integrity Tests', () => {
  const getAuthToken = async (email, password) => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    return res.body.token;
  };

  // Publish a release and hand back the identifier the frontend would hold
  const publishFixture = async (adminToken, version, stageName) => {
    const pubRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: `Original title ${version}`,
        version,
        author: 'ignored, taken from JWT',
        stageName,
        changeSummary: 'Original summary text.',
        commit: 'aaaaaaa',
        assets: []
      });
    expect(pubRes.status).toBe(201);
    return pubRes.body.stageId;
  };

  it('should restrict release edits to Admin role only', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const instToken = await getAuthToken('instructor@workspace.edu', 'inst123');
    const userToken = await getAuthToken('student@workspace.edu', 'student123');

    const stageId = await publishFixture(adminToken, 'v8.0', 'Edit Auth Stage');
    const payload = { title: 'Hacked', stageName: 'Hacked Stage', changeSummary: 'Hacked summary.' };

    const anonRes = await request(app).patch(`/api/releases/${stageId}`).send(payload);
    expect(anonRes.status).toBe(401);

    const instRes = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${instToken}`)
      .send(payload);
    expect(instRes.status).toBe(403);

    const userRes = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);
    expect(userRes.status).toBe(403);

    // Nothing should have changed
    const stage = await db.query('SELECT name FROM stages WHERE id = $1', [stageId]);
    expect(stage.rows[0].name).toBe('Edit Auth Stage');
  });

  it('should update publication, changelog, stage and activity together', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const stageId = await publishFixture(adminToken, 'v8.1', 'Edit Sync Stage');

    const res = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Corrected Title',
        stageName: 'Corrected Stage Name',
        changeSummary: 'Corrected summary text.',
        commit: 'bbbbbbb'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const pub = await db.query('SELECT title, changes FROM publications WHERE version = $1', ['v8.1']);
    expect(pub.rows[0].title).toBe('Corrected Title');
    expect(pub.rows[0].changes).toBe('Corrected summary text.');

    const ver = await db.query('SELECT change_summary, commit_sha FROM project_versions WHERE version = $1', ['v8.1']);
    expect(ver.rows[0].change_summary).toBe('Corrected summary text.');
    expect(ver.rows[0].commit_sha).toBe('bbbbbbb');

    const stage = await db.query('SELECT name, summary, commit_sha FROM stages WHERE id = $1', [stageId]);
    expect(stage.rows[0].name).toBe('Corrected Stage Name');
    expect(stage.rows[0].summary).toBe('Corrected summary text.');
    expect(stage.rows[0].commit_sha).toBe('bbbbbbb');

    const act = await db.query('SELECT action FROM activities WHERE version = $1', ['v8.1']);
    expect(act.rows[0].action).toContain('Corrected Title');

    // The version tag is the join key and must survive untouched
    const stillThere = await db.query('SELECT id FROM publications WHERE version = $1', ['v8.1']);
    expect(stillThere.rows.length).toBe(1);
  });

  it('should accept the same stage name when saving without renaming', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const stageId = await publishFixture(adminToken, 'v8.2', 'Edit Idempotent Stage');

    const res = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Only the title moved',
        stageName: 'Edit Idempotent Stage',
        changeSummary: 'Original summary text.'
      });

    expect(res.status).toBe(200);
  });

  it('should reject a rename that collides with another milestone', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    await publishFixture(adminToken, 'v8.3', 'Edit Collision Target');
    const stageId = await publishFixture(adminToken, 'v8.4', 'Edit Collision Source');

    const res = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Title',
        stageName: '  edit collision target  ',
        changeSummary: 'Summary.'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('already exists');

    const stage = await db.query('SELECT name FROM stages WHERE id = $1', [stageId]);
    expect(stage.rows[0].name).toBe('Edit Collision Source');
  });

  it('should validate required fields and commit SHA format', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const stageId = await publishFixture(adminToken, 'v8.5', 'Edit Validation Stage');

    const missing = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Title', changeSummary: 'Summary.' });
    expect(missing.status).toBe(400);

    const badCommit = await request(app)
      .patch(`/api/releases/${stageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Title', stageName: 'Edit Validation Stage', changeSummary: 'Summary.', commit: 'xyz' });
    expect(badCommit.status).toBe(400);
    expect(badCommit.body.error).toContain('7 hexadecimal');
  });

  it('should accept stage, pub-prefixed and raw numeric identifiers', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');
    const stageId = await publishFixture(adminToken, 'v8.6', 'Edit Id Forms Stage');
    const pubRow = await db.query('SELECT id FROM publications WHERE version = $1', ['v8.6']);
    const pubId = pubRow.rows[0].id;

    const identifiers = [stageId, `pub-${pubId}`, String(pubId)];
    for (let idx = 0; idx < identifiers.length; idx++) {
      const res = await request(app)
        .patch(`/api/releases/${identifiers[idx]}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: `Title via form ${idx}`,
          stageName: 'Edit Id Forms Stage',
          changeSummary: 'Summary.'
        });
      expect(res.status).toBe(200);
    }

    const pub = await db.query('SELECT title FROM publications WHERE version = $1', ['v8.6']);
    expect(pub.rows[0].title).toBe('Title via form 2');
  });

  it('should return 404 for an unknown release', async () => {
    const adminToken = await getAuthToken('admin@workspace.edu', 'admin123');

    const res = await request(app)
      .patch('/api/releases/stage-does-not-exist')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Title', stageName: 'Nowhere', changeSummary: 'Summary.' });

    expect(res.status).toBe(404);
  });
});
