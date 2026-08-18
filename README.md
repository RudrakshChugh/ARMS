# UCS503 Engineering Project Portal

A web platform for publishing and documenting university software engineering projects. It tracks releases, milestone timelines, project versions, and staged deliverable files under role-based access.

## Architecture

The system follows a three-tier design: a React single-page application, a Node.js API gateway, and a PostgreSQL database.

```
React Client (Vite)
        |
        |  REST API via VITE_API_URL
        v
Node.js + Express.js API Gateway (Port 5000)
        |
        |-- Multer file stager (backend/uploads/ local fallback)
        |
        v
PostgreSQL database server (node-postgres pg Pool)
```

The frontend is built with Vite, React, and Tailwind CSS. The backend exposes a REST API that authenticates users, stages file uploads, and writes release records inside database transactions.

## Prerequisites

- Node.js 18 or later
- PostgreSQL 12 or later
- npm

## Configuration

### Frontend

Create a `.env` file in the repository root:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ucs503_portal
JWT_SECRET=replace_with_a_long_random_value
```

Do not commit real secrets. Keep actual credentials in a local, gitignored `.env` file on each environment.

## Database Setup

1. Create the schema:

   ```bash
   psql -U postgres -d ucs503_portal -f database/schema.sql
   ```

2. Load seed data:

   ```bash
   psql -U postgres -d ucs503_portal -f database/seed.sql
   ```

### Local Development Accounts

Passwords are stored as bcrypt hashes and are intended for local testing only:

- Admin: `admin@workspace.edu` / `admin123`
- Instructor: `instructor@workspace.edu` / `inst123`
- Student: `student@workspace.edu` / `student123`

## Running Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
npm install
npm run dev
```

Open the frontend at the URL printed by Vite and log in with one of the development accounts.

## Testing

Frontend tests use Vitest with jsdom:

```bash
npm test
```

Backend tests run against an isolated test database:

```bash
cd backend
npm test
```

## API Overview

| Method | Endpoint              | Description                                        |
|--------|-----------------------|----------------------------------------------------|
| POST   | /api/auth/login       | Authenticate a user and issue a JWT               |
| GET    | /api/auth/me          | Restore the active user session                   |
| GET    | /api/stages           | List timeline milestones                          |
| GET    | /api/releases         | List published releases and their assets          |
| POST   | /api/releases         | Publish a release inside a SQL transaction        |
| POST   | /api/files/upload     | Stage an uploaded deliverable file (50 MB limit)  |

## Role Model

- Admin: full access, including publishing releases and managing stored files.
- Instructor: can publish releases and update milestone stages.
- Student: read-only access to the published timeline, versions, and releases.

## Deployment Notes

The frontend can be built for static hosting:

```bash
npm run build
```

The output in `dist/` is deployable to any static host. For GitHub Pages behind a subpath, set `base` in `vite.config.js` to match the repository path. The backend requires a running PostgreSQL instance and the environment variables listed above.
