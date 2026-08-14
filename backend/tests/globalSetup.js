import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.DATABASE_URL || '';

export default async function () {
  // SAFETY GUARD CHECK: Ensure database is strictly semester_portal_test
  if (!dbUrl.endsWith('/semester_portal_test')) {
    console.error('\n======================================================');
    console.error('CRITICAL SAFETY BLOCK: Aborting test run.');
    console.error('DATABASE_URL must point strictly to "semester_portal_test"');
    console.error(`Current DATABASE_URL: ${dbUrl}`);
    console.error('======================================================\n');
    process.exit(1);
  }

  console.log('\n--- GLOBAL SETUP: INITIALIZING ISOLATED TEST DATABASE ---');
  
  // 1. Connect to postgres database to ensure target test database exists
  const rootUrl = dbUrl.replace('/semester_portal_test', '/postgres');
  const client = new pg.Client({ connectionString: rootUrl });
  
  try {
    await client.connect();
    // Drop test database if exists to ensure a clean state
    await client.query('DROP DATABASE IF EXISTS semester_portal_test;');
    await client.query('CREATE DATABASE semester_portal_test;');
    console.log('Isolated test database semester_portal_test created.');
  } catch (err) {
    console.error('Error creating test database:', err.message);
    throw err;
  } finally {
    await client.end();
  }

  // 2. Connect to test database and run schema.sql
  const testPool = new pg.Pool({ connectionString: dbUrl });
  try {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema sql
    await testPool.query(schemaSql);
    console.log('Schema initialized successfully.');

    // 3. Seed isolated base test records
    await testPool.query(`
      INSERT INTO users (id, name, email, password_hash, role) VALUES
      (1, 'Manya Kedia', 'admin@workspace.edu', '$2a$10$rdsZKv3MNuPgP0Nv0kM27eCYTFQC98AncE.pyy5pQgdppU6FhX5ye', 'admin'),
      (2, 'Instructor Profile', 'instructor@workspace.edu', '$2a$10$bKPt3ngPh1QHcTsS74rrcepQ8W/V0e2d6kHjJBe6fIu8DX6n08xhe', 'instructor'),
      (3, 'Aarav Sharma', 'student@workspace.edu', '$2a$10$bY3jLcchW2NsBpernVp/ye8Jd1mVfx43JqAvjxIbGM4xVDKCK/xyG', 'user');
      
      SELECT setval('users_id_seq', 3);

      INSERT INTO projects (id, name, description, created_by, is_primary) VALUES
      (1, 'CollabSync', 'Real-time collaborative text code editor sandbox workspace.', 1, TRUE);
      
      SELECT setval('projects_id_seq', 1);

      INSERT INTO stages (id, project_id, name, date, status, owner, version, summary, changes, commit_sha, details, assets, order_number) VALUES
      ('stage-1', 1, 'Idea Exploration', 'Aug 10, 2026', 'Completed', 'Manya Kedia', 'v0.1', 'Idea Exploration summary', 'initial changes', 'f1a2b3c', '[]'::jsonb, '[]'::jsonb, 1),
      ('stage-2', 1, 'Software Grid', 'Aug 18, 2026', 'Completed', 'Aarav Sharma', 'v0.5', 'Software Grid summary', 'matrix changes', 'd4e5f6a', '[]'::jsonb, '[]'::jsonb, 2),
      ('stage-3', 1, 'Planning V1', 'Aug 26, 2026', 'Completed', 'Manya Kedia', 'v1.0', 'Planning V1 summary', 'specs changes', 'a82fc21', '[]'::jsonb, '[]'::jsonb, 3),
      ('stage-4', 1, 'Planning V2', 'Sep 10, 2026', 'In Progress', 'Aarav Sharma', 'v1.2', 'Planning V2 summary', 'detailed spec changes', '9c8b7a6', '[]'::jsonb, '[]'::jsonb, 4);
    `);
    
    console.log('Seeded isolated test data successfully.');
  } catch (err) {
    console.error('Error initializing schema / seed data:', err.message);
    throw err;
  } finally {
    await testPool.end();
  }
}
