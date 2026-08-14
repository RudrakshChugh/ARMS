import dotenv from 'dotenv';
import db from '../src/config/db.js';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || '';

// SAFETY GUARD CHECK: Ensure database is strictly semester_portal_test
if (!dbUrl.endsWith('/semester_portal_test')) {
  console.error('\n======================================================');
  console.error('CRITICAL SAFETY BLOCK: Aborting test run.');
  console.error('DATABASE_URL must point strictly to "semester_portal_test"');
  console.error(`Current DATABASE_URL: ${dbUrl}`);
  console.error('======================================================\n');
  process.exit(1);
}

afterAll(async () => {
  // End connection pool cleanly on test run end to prevent process hangs
  if (db && db.pool) {
    await db.pool.end();
  }
});
