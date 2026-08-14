-- PostgreSQL Database Schema for UCS503 Engineering Project Portal

DROP TABLE IF EXISTS responsibility_matrix CASCADE;
DROP TABLE IF EXISTS project_ideas CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS publication_files CASCADE;
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS project_versions CASCADE;
DROP TABLE IF EXISTS stages CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    auth_provider VARCHAR(50) DEFAULT 'local',
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'student', 'instructor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.1 Secure Authorization Codes Table
CREATE TABLE auth_codes (
    code VARCHAR(255) PRIMARY KEY,
    jwt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Project Members Table
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Project Journey Stages Table
CREATE TABLE stages (
    id VARCHAR(50) PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    date VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Completed', 'In Progress')),
    owner VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    summary TEXT,
    changes TEXT,
    commit_sha VARCHAR(50),
    details JSONB DEFAULT '[]'::jsonb,
    assets JSONB DEFAULT '[]'::jsonb,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Publications Table
CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(50) UNIQUE NOT NULL,
    date VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    changes TEXT,
    assets_count INTEGER DEFAULT 0,
    pipeline JSONB DEFAULT '[]'::jsonb,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Publication Files Table
CREATE TABLE publication_files (
    id SERIAL PRIMARY KEY,
    publication_id INTEGER REFERENCES publications(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size VARCHAR(50) NOT NULL,
    path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Project Versions (Changelogs) Table
CREATE TABLE project_versions (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(50) UNIQUE NOT NULL,
    date VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    change_summary TEXT NOT NULL,
    commit_sha VARCHAR(50) NOT NULL,
    files_changed JSONB DEFAULT '[]'::jsonb,
    added JSONB DEFAULT '[]'::jsonb,
    modified JSONB DEFAULT '[]'::jsonb,
    removed JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Activities Table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    person VARCHAR(100) NOT NULL,
    timestamp VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Project Ideas Table (Software Grid Comparison)
CREATE TABLE project_ideas (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(255),
    tag VARCHAR(100),
    description TEXT,
    problem TEXT,
    target_audience TEXT,
    technical_stack JSONB DEFAULT '[]'::jsonb,
    risk_mitigation TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Responsibility Matrix Table
CREATE TABLE responsibility_matrix (
    id SERIAL PRIMARY KEY,
    area VARCHAR(255) NOT NULL,
    primary_owner VARCHAR(100) NOT NULL,
    secondary_owner VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL
);
