-- Migration: Support Google Authentication and role defaults

-- 1. Make password_hash NULLable
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Add google_id and auth_provider columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';

-- 3. Drop existing constraint first to allow role updates
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- 4. Migrate any existing 'student' roles to 'user'
UPDATE users SET role = 'user' WHERE role = 'student';

-- 5. Add new role CHECK constraint
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'instructor', 'admin'));

-- 6. Set default role to 'user'
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- 6. Create auth_codes table for secure token exchange
CREATE TABLE IF NOT EXISTS auth_codes (
    code VARCHAR(255) PRIMARY KEY,
    jwt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
