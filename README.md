# UCS503 Engineering Project Portal (Phase 5)

An academic release portal documenting the design and implementation of university software engineering projects.

---

## 1. Project Architecture

```
React Client (Vite)
       │
       ▼ (REST API via VITE_API_URL)
Node.js + Express.js API Gateway (Port 5000)
       │
       ├──────────────→ Multer File Stager (backend/uploads/ development fallback)
       │
       ▼ (node-postgres pg Pool client)
PostgreSQL Database Server
```

---

## 2. Environment Configurations

### Frontend Workspace (`.env`)
Create a `.env` file in the repository root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Express Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ucs503_portal
JWT_SECRET=super_secret_session_security_token_phrase
```

---

## 3. Database Initialization & Seeding

1. **Schema Initialization**:
   Create the database schema by importing `database/schema.sql` into your local PostgreSQL instance:
   ```bash
   psql -U postgres -d ucs503_portal -f database/schema.sql
   ```

2. **Seeding Development Data**:
   Import mock records, timeline journey stages, and hashed credentials:
   ```bash
   psql -U postgres -d ucs503_portal -f database/seed.sql
   ```

### Local Development User Accounts
These accounts are hashed with bcrypt for local security verification:
- **Admin**: `admin@workspace.edu` (password: `admin123`)
- **Instructor**: `instructor@workspace.edu` (password: `inst123`)
- **Student**: `student@workspace.edu` (password: `student123`)

*Warning: These credentials are designated for local testing. Never commit production secrets.*

---

## 4. How to Run the Application

### Start the Backend API Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install server-side dependencies:
   ```bash
   npm install
   ```
3. Start the node server:
   ```bash
   npm start
   ```

### Start the Frontend Client
1. Install client dependencies in the root folder:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---

## 5. API Routes Overview

- **`POST /api/auth/login`**: Sign in and sign JWT token.
- **`GET /api/auth/me`**: Restores active user session.
- **`GET /api/stages`**: Fetch timeline milestones.
- **`GET /api/releases`**: Fetch staged publication files.
- **`POST /api/releases`**: Publishes a release (Admin/Instructor role required, executes inside SQL transaction block).
- **`POST /api/files/upload`**: Local staging upload utilizing Multer (checks 50MB sizes constraints).
