import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import db from '../src/config/db.js';
import storageService, { LocalStorageService, R2StorageService } from '../src/services/storage/index.js';
import fs from 'fs';
import path from 'path';

// Mock the AWS S3 Client SDK commands using standard constructible ES6 classes
import { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

vi.mock('@aws-sdk/client-s3', () => {
  class MockS3Client {
    async send(command) {
      if (command instanceof PutObjectCommand) {
        return { $metadata: { httpStatusCode: 200 } };
      }
      if (command instanceof DeleteObjectCommand) {
        return { $metadata: { httpStatusCode: 200 } };
      }
      if (command instanceof HeadObjectCommand) {
        return { $metadata: { httpStatusCode: 200 } };
      }
      return {};
    }
  }

  return {
    S3Client: MockS3Client,
    PutObjectCommand: class PutObjectCommand {},
    GetObjectCommand: class GetObjectCommand {},
    DeleteObjectCommand: class DeleteObjectCommand {},
    HeadObjectCommand: class HeadObjectCommand {}
  };
});

vi.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: vi.fn().mockResolvedValue('https://mock-r2-presigned-url.com/publications/test-file.pdf?token=123')
  };
});

describe('Cloudflare R2 Storage Abstraction & Integration API Tests', () => {
  let adminToken;

  beforeEach(async () => {
    // Authenticate admin user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@workspace.edu', password: 'admin123' });
    adminToken = loginRes.body.token;

    // Clean up publications and stages with test-specific names
    await db.query("DELETE FROM publications WHERE version = 'v10.0' OR version = 'v10.1' OR version = 'v9.99'");
    await db.query("DELETE FROM stages WHERE version = 'v10.0' OR version = 'v10.1' OR version = 'v9.99'");
    await db.query("DELETE FROM project_versions WHERE version = 'v10.0' OR version = 'v10.1' OR version = 'v9.99'");
    await db.query("DELETE FROM activities WHERE version = 'v10.0' OR version = 'v10.1' OR version = 'v9.99'");
  });

  // 1. Instantiation Checks
  it('should instantiate LocalStorageService when STORAGE_PROVIDER = local', () => {
    const localService = new LocalStorageService();
    expect(localService).toBeInstanceOf(LocalStorageService);
  });

  it('should instantiate R2StorageService when STORAGE_PROVIDER = r2', () => {
    const r2Service = new R2StorageService();
    expect(r2Service).toBeInstanceOf(R2StorageService);
  });

  // 2. Local File Storage logic
  it('should upload, url resolve, and delete locally using LocalStorageService', async () => {
    const service = new LocalStorageService();
    const tempFile = path.resolve('uploads', 'temp-local-test.pdf');
    fs.writeFileSync(tempFile, 'PDF Buffer content');

    const pathUrl = await service.uploadFile(tempFile, 'temp-local-test.pdf', 'application/pdf');
    expect(pathUrl).toBe('/uploads/temp-local-test.pdf');

    const fileUrl = await service.getFileUrl(pathUrl);
    expect(fileUrl).toBe('/uploads/temp-local-test.pdf');

    const exists = await service.fileExists(pathUrl);
    expect(exists).toBe(true);

    await service.deleteFile(pathUrl);
    expect(fs.existsSync(tempFile)).toBe(false);
  });

  // 3. R2 Mock storage logic
  it('should trigger S3 PutObject / GetObject / DeleteObject commands using R2StorageService', async () => {
    const service = new R2StorageService();
    const tempFile = path.resolve('uploads', 'temp-r2-test.png');
    fs.writeFileSync(tempFile, 'PNG Buffer bytes');

    // Mock upload
    const objectKey = await service.uploadFile(tempFile, 'temp-r2-test.png', 'image/png');
    expect(objectKey).toContain('publications/');
    expect(objectKey).toContain('-temp-r2-test.png');
    expect(fs.existsSync(tempFile)).toBe(false); // temporary file should be unlinked

    // Mock url resolution
    const signedUrl = await service.getFileUrl(objectKey);
    expect(signedUrl).toContain('mock-r2-presigned-url.com');
    expect(getSignedUrl).toHaveBeenCalled();

    // Mock exist query
    const exists = await service.fileExists(objectKey);
    expect(exists).toBe(true);

    // Mock delete
    const deleted = await service.deleteFile(objectKey);
    expect(deleted).toBe(true);
  });

  // 4. Secure Redirect Resolution GET /api/files/:id
  it('should retrieve a file and redirect browser to signed URL / relative path', async () => {
    // 1. Insert dummy publication first to satisfy foreign key constraint
    const pubRes = await db.query(
      `INSERT INTO publications (project_id, version, date, author, title, changes, assets_count)
       VALUES (1, 'v9.99', '2026-08-09', 'Admin', 'Dummy Title', 'Dummy changes', 1) RETURNING id`
    );
    const pubId = pubRes.rows[0].id;

    // 2. Insert metadata file row referencing this publication
    const testKey = 'publications/1786/mock-deliverable.pdf';
    const insertRes = await db.query(
      `INSERT INTO publication_files (publication_id, name, type, size, path)
       VALUES ($1, 'mock-deliverable.pdf', 'pdf', '1.2 MB', $2) RETURNING id`,
      [pubId, testKey]
    );
    const fileId = insertRes.rows[0].id;

    // 3. Fetch secure endpoint
    const res = await request(app)
      .get(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    // If STORAGE_PROVIDER=local is active in this test environment:
    if (process.env.STORAGE_PROVIDER === 'r2') {
      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('mock-r2-presigned-url.com');
    } else {
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(testKey);
    }

    // Clean up DB row
    await db.query('DELETE FROM publication_files WHERE id = $1', [fileId]);
  });

  // 5. Complete publication release flow with compensation logic
  it('should run atomic transaction and perform storage compensation deletes if DB insert fails', async () => {
    // 1. Pre-insert version 'v10.1' so the database transaction is guaranteed to throw a 409 duplicate conflict
    await db.query(
      `INSERT INTO publications (project_id, version, date, author, title, changes, assets_count)
       VALUES (1, 'v10.1', '2026-08-09', 'Admin', 'Original Title', 'Original changes', 0)`
    );

    // Staging upload mock file path
    const uploadKey = 'publications/9999/atomic-fail-spec.pptx';

    // Build release publish query designed to fail
    const badPayload = {
      title: 'Failed Atomic Release',
      version: 'v10.1', // Guaranteed duplicate version conflict!
      author: 'Admin',
      stageName: 'Atomic Fail Stage',
      changeSummary: 'Should fail and trigger R2 compensation.',
      commit: 'f32a0d1',
      assets: [
        {
          name: 'atomic-fail-spec.pptx',
          type: 'pptx',
          size: '2.5 MB',
          path: uploadKey
        }
      ]
    };

    // Spy on deleteFile method of the active storageService factory
    const deleteSpy = vi.spyOn(storageService, 'deleteFile');

    const res = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(badPayload);

    // Assert database transaction rolled back
    expect(res.status).toBe(409); // Conflict version error

    // Assert compensation delete was invoked for staged file
    expect(deleteSpy).toHaveBeenCalledWith(uploadKey);
    deleteSpy.mockRestore();
  });

  // 6. Cascade deletion checks
  it('should cascade delete and remove files from storage provider during delete release', async () => {
    const service = new LocalStorageService();
    const testFile = path.resolve('uploads', 'cascade-test.pdf');
    fs.writeFileSync(testFile, 'cascade test');

    const pathUrl = await service.uploadFile(testFile, 'cascade-test.pdf', 'application/pdf');

    // 1. Publish release
    const payload = {
      title: 'Cascade Release',
      version: 'v10.0',
      author: 'Admin',
      stageName: 'Cascade Test Stage',
      changeSummary: 'Cascade verification description.',
      commit: 'c43b92d',
      assets: [
        {
          name: 'cascade-test.pdf',
          type: 'pdf',
          size: '1.0 MB',
          path: pathUrl
        }
      ]
    };

    const pubRes = await request(app)
      .post('/api/releases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(pubRes.status).toBe(201);
    const stageId = pubRes.body.stageId;

    // Verify stage assets contains the file id
    const stageCheck = await db.query('SELECT assets FROM stages WHERE id = $1', [stageId]);
    const assets = stageCheck.rows[0].assets;
    expect(assets[0]).toHaveProperty('id');
    expect(assets[0].name).toBe('cascade-test.pdf');

    // 2. Fetch publication record id to invoke deletion
    const pubCheck = await db.query("SELECT id FROM publications WHERE version = 'v10.0'");
    const pubId = pubCheck.rows[0].id;

    // Spy on deleteFile
    const deleteSpy = vi.spyOn(storageService, 'deleteFile');

    // 3. Delete release
    const delRes = await request(app)
      .delete(`/api/releases/${pubId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(delRes.status).toBe(200);
    expect(deleteSpy).toHaveBeenCalledWith(pathUrl);

    // Verify DB records are cleared
    const checkStages = await db.query("SELECT id FROM stages WHERE version = 'v10.0'");
    expect(checkStages.rows.length).toBe(0);

    deleteSpy.mockRestore();
  });
});
