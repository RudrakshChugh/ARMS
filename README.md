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
        |-- Multer file stager -> pluggable storage (local disk | Supabase | Cloudflare R2)
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

Create a `.env` file in the `backend/` directory. See `backend/.env.example` for the full list.

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/semester_portal
JWT_SECRET=replace_with_a_long_random_value
FRONTEND_URL=http://localhost:5173
STORAGE_PROVIDER=local
```

`DATABASE_URL` and `JWT_SECRET` are mandatory; the server refuses to start without them. `FRONTEND_URL` is used for OAuth redirects and is appended to the CORS allowlist, which otherwise permits only `http://localhost:5173` and `http://localhost:3000`.

Google sign-in additionally requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL`. Non-local file storage requires the `SUPABASE_*` or `R2_*` variables for the selected provider.

Do not commit real secrets. Keep actual credentials in a local, gitignored `.env` file on each environment.

## Database Setup

1. Create the schema:

   ```bash
   psql -U postgres -d semester_portal -f database/schema.sql
   ```

2. Load seed data:

   ```bash
   psql -U postgres -d semester_portal -f database/seed.sql
   ```

3. Apply the migrations:

   ```bash
   psql -U postgres -d semester_portal -f database/migrations/001_google_auth.sql
   psql -U postgres -d semester_portal -f database/migrations/002_increase_file_type_length.sql
   ```

### Local Development Accounts

Passwords are stored as bcrypt hashes and are intended for local testing only:

- Admin: `admin@workspace.edu` / `admin123`
- Instructor: `instructor@workspace.edu` / `inst123`
- User: `student@workspace.edu` / `student123`

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

Open the frontend at the URL printed by Vite and log in with one of the development accounts. Note that `npm start` in the repository root is an alias that installs and starts the **backend**; use `npm run dev` for the frontend.

## Testing

Frontend tests use Vitest with jsdom:

```bash
npm test
```

Backend tests run against an isolated test database. The suite drops and recreates `semester_portal_test` on every run and refuses to start unless `DATABASE_URL` points at that database:

```bash
cd backend
npm test
```

## API Overview

Read endpoints are public. Write endpoints require a bearer token from a user whose stored role is `admin`.

| Method | Endpoint                    | Access | Description                                        |
|--------|-----------------------------|--------|----------------------------------------------------|
| POST   | /api/auth/login             | Public | Authenticate a user and issue a JWT                |
| POST   | /api/auth/register          | Public | Create an account (always assigned the `user` role) |
| GET    | /api/auth/me                | Auth   | Restore the active user session                    |
| GET    | /api/auth/google            | Public | Redirect to the Google consent screen              |
| GET    | /api/auth/google/callback   | Public | Handle the Google redirect and issue a one-time code |
| POST   | /api/auth/google/token      | Public | Exchange the one-time code for a JWT               |
| GET    | /api/projects               | Public | List candidate project ideas (software grid)       |
| GET    | /api/projects/matrix        | Public | Responsibility matrix                              |
| GET    | /api/projects/team          | Public | Team members                                       |
| GET    | /api/stages                 | Public | List timeline milestones                           |
| GET    | /api/stages/:id             | Public | Fetch one milestone                                |
| PATCH  | /api/stages/:id/complete    | Admin  | Mark a milestone complete                          |
| GET    | /api/versions               | Public | Version changelog                                  |
| GET    | /api/activities             | Public | Activity feed                                      |
| GET    | /api/releases               | Public | List published releases and their assets           |
| POST   | /api/releases               | Admin  | Publish a release inside a SQL transaction         |
| PATCH  | /api/releases/:id           | Admin  | Edit a published release, its version and its files |
| DELETE | /api/releases/:id           | Admin  | Delete a release and every record derived from it  |
| POST   | /api/files/upload           | Admin  | Stage an uploaded deliverable file (50 MB limit)   |
| GET    | /api/files/:id              | Public | Redirect to a deliverable file URL                 |
| DELETE | /api/files/:path            | Admin  | Remove an orphaned staged file from storage        |

`GET /api/files/:id` is intentionally unauthenticated because `<img>`, `<iframe>`, and `<object>` tags cannot send an `Authorization` header.

## Role Model

- `admin`: full access, including publishing releases, editing and deleting them, marking milestones complete, and managing stored files.
- `instructor`: authenticated read access; no write endpoints.
- `user`: default role for every self-registered and Google-authenticated account.

Registration never accepts a client-supplied role. Elevated roles are granted directly in the database by an existing administrator. Authorization decisions read the role from the database on every request rather than trusting the role claim inside the JWT, so a demotion takes effect immediately.

## Deployment Notes

The frontend can be built for static hosting:

```bash
npm run build
```

The output in `dist/` is deployable to any static host, and `.github/workflows/deploy.yml` publishes it to GitHub Pages. The site is served from the `/ARMS/` subpath, which is configured in two places that must stay in sync: `base` in `vite.config.js` and `basename` on the router in `src/App.jsx`.

The backend is deployed separately and requires a running PostgreSQL instance plus the environment variables listed above.
