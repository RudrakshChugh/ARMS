import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Backend File Staging, Uploads & Content Retrieval API Tests', () => {
  const getAuthToken = async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@workspace.edu', password: 'admin123' });
    return res.body.token;
  };

  const formats = [
    { ext: 'pdf', mime: 'application/pdf', content: '%PDF-1.4 dummy contents' },
    { ext: 'png', mime: 'image/png', content: '\x89PNG\r\n\x1a\n dummy image bytes' },
    { ext: 'jpg', mime: 'image/jpeg', content: 'dummy jpg bytes' },
    { ext: 'jpeg', mime: 'image/jpeg', content: 'dummy jpeg bytes' },
    { ext: 'ppt', mime: 'application/vnd.ms-powerpoint', content: 'dummy ppt slides bytes' },
    { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', content: 'dummy pptx slides bytes' }
  ];

  const provider = process.env.STORAGE_PROVIDER || 'local';

  formats.forEach(({ ext, mime, content }) => {
    it(`should upload, store, and retrieve file format: .${ext}`, async () => {
      const adminToken = await getAuthToken();
      const testBuffer = Buffer.from(content);
      const filename = `test.${ext}`;

      // 1. Upload the file
      console.log(`Uploading test.${ext} file...`);
      const uploadRes = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('file', testBuffer, filename);

      expect(uploadRes.status).toBe(201);
      expect(uploadRes.body).toHaveProperty('success', true);
      
      const fileMeta = uploadRes.body.file;
      expect(fileMeta.path).not.toBeNull();

      if (provider !== 'local') {
        // Remote storage (e.g. supabase) returns a storage object key
        // (publications/<ts>/<id>-file.ext); no local disk to inspect.
        expect(fileMeta.path).toMatch(/^publications\//);
        return;
      }

      // 2. Local storage: path is served under /uploads/
      expect(fileMeta.path).toContain('/uploads/');

      // Verify physical file exists on disk
      const storedFilename = fileMeta.path.replace('/uploads/', '');
      const physicalPath = path.join(__dirname, '../uploads', storedFilename);
      expect(fs.existsSync(physicalPath)).toBe(true);

      // Verify stored file size is identical to original buffer size
      const diskStats = fs.statSync(physicalPath);
      expect(diskStats.size).toBe(testBuffer.length);

      // 3. Request the actual file URL from backend
      console.log(`Verifying static retrieval: GET ${fileMeta.path}...`);
      const getRes = await request(app)
        .get(fileMeta.path)
        .buffer()
        .parse((res, callback) => {
          let data = [];
          res.on('data', chunk => { data.push(chunk); });
          res.on('end', () => { callback(null, Buffer.concat(data)); });
        });

      expect(getRes.status).toBe(200);
      
      // Compare Content-Type header
      expect(getRes.headers['content-type']).toContain(mime);

      // Verify response body contains actual uploaded content bytes
      const retrievedBuffer = getRes.body;
      expect(retrievedBuffer.toString()).toBe(testBuffer.toString());

      // Safety checks: ensure it is not HTML or JSON string
      const responseText = retrievedBuffer.toString('utf8');
      expect(responseText.startsWith('<!DOCTYPE html>')).toBe(false);
      expect(responseText.startsWith('{"')).toBe(false);

      // Clean up physical file after verification to keep workspace clean
      fs.unlinkSync(physicalPath);
    });
  });
});
