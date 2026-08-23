# Project Notes — UCS503 Engineering Project Portal ("ARMS")

Orientation notes for an LLM/agent asked to work on this repo. Read this before
touching code; it records the things that are *not* obvious from the file tree.

---

## 1. What this is

A web portal that documents a university software-engineering course project.
It is a **public read / admin write** site: anyone can browse the project's
milestone timeline, version changelog, planning specs, team page and release
history; only a logged-in **admin** can publish a release, upload deliverable
files, delete a release, or mark a milestone complete.

The "product" being documented is a project called **CollabSync**; the portal
itself is the deliverable being graded.

The deployed frontend lives under the subpath **`/ARMS/`** (GitHub Pages).

---

## 2. Repo layout

```
/                      React + Vite frontend (root package.json)
  src/
    App.jsx            Router, route table, AdminRoute guard, global search, design-system demo page
    main.jsx           ReactDOM root -> ThemeProvider -> App
    index.css          Tailwind v4 @theme block: ALL design tokens live here
    context/
      AppContext.jsx   Single global store: auth + every data table + mutations
      ThemeContext.jsx light/dark, writes data-theme on <html>
    services/api.js    The ONLY place that talks HTTP. Thin fetch wrapper.
    pages/             Home, Journey, JourneyDetails, Versions, Team,
                       ReleaseControl, Login, LoginCallback
                       (+ Planning.jsx, currently unrouted — see section 8)
    components/layout/ Navbar, Footer
    components/ui/     Button, Card, Badge, Input, Select, Modal,
                       DocumentPreview (pdf/img/md/video viewer), SoftwareGridSection
    data/              planning.js only (static content for the disabled Planning page)
    tests/             frontend.test.jsx + setup.js (vitest + jsdom)

backend/               Express REST API (own package.json, ESM, "type": "module")
  src/server.js        App bootstrap, CORS allowlist, route mounts, error boundary
  src/config/db.js     pg Pool; exports { query, pool }
  src/middleware/authMiddleware.js   requireAuth, requireRole([...])
  src/routes/*.js      One router per resource
  src/controllers/*.js Business logic + raw SQL (no ORM)
  src/services/storage/ Pluggable file storage (Local | Supabase | R2)
  tests/               vitest + supertest against a real throwaway Postgres DB
  uploads/             Local-storage fallback dir (gitignored)

database/
  schema.sql           Full DROP+CREATE of all tables
  seed.sql             Local dev seed data
  migrations/          001_google_auth.sql, 002_increase_file_type_length.sql

.github/workflows/     ci.yml (test+build), deploy.yml (GitHub Pages)
```

There is **no ORM, no TypeScript, no state library**. Plain SQL strings, plain
React context, plain `fetch`.

---

## 3. Stack

| Layer | Choice |
|---|---|
| Frontend | React 18, Vite 5, react-router-dom 6, Tailwind CSS **v4** (`@tailwindcss/vite`), framer-motion, lucide-react |
| Backend | Node 18+, Express 4, `pg` (node-postgres), `jsonwebtoken`, `bcryptjs`, `multer`, `cors`, `dotenv` |
| DB | PostgreSQL 12+ |
| Storage | Local disk / Supabase Storage / Cloudflare R2 (see section 7) |
| Tests | Vitest everywhere — jsdom + Testing Library (front), node + supertest (back) |

Tailwind v4 has **no `tailwind.config.js`**. Tokens are declared in the
`@theme { ... }` block at the top of `src/index.css` (colors, font sizes, a
`--spacing-sp-*` 4pt grid, radii — all radii are `0px`, the design is
deliberately flat/architectural). Class names like `px-sp-16`, `text-section`,
`bg-bg-surface`, `text-text-secondary` come from those tokens. **Add new design
values to `@theme`, not as arbitrary values.**

---

## 4. Running it

```bash
# backend
cd backend && npm install && npm start     # http://localhost:5000

# frontend (repo root)
npm install && npm run dev                 # http://localhost:5173/ARMS/
```

`npm start` at the root is a convenience alias that installs and starts the
**backend**, not the frontend. Use `npm run dev` for the frontend.

DB setup:

```bash
psql -U postgres -d semester_portal -f database/schema.sql
psql -U postgres -d semester_portal -f database/seed.sql
psql -U postgres -d semester_portal -f database/migrations/001_google_auth.sql
psql -U postgres -d semester_portal -f database/migrations/002_increase_file_type_length.sql
```

### Environment variables

Root `.env` (frontend, Vite):

- `VITE_API_URL` — e.g. `http://localhost:5000/api`.
  If unset, `src/services/api.js` falls back to the hardcoded production host
  `https://rudraksh.alwaysdata.net/api`.

`backend/.env`:

- `PORT` (default 5000)
- `DATABASE_URL` — **required**, the server exits at boot if missing
- `JWT_SECRET` — **required**, the server exits at boot if missing
- `FRONTEND_URL` — used for OAuth redirects *and* appended to the CORS allowlist
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `STORAGE_PROVIDER` = `local` (default) | `supabase` | `r2`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- `R2_ACCOUNT_ID` (or `R2_ENDPOINT`), `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
  `R2_BUCKET_NAME`

The CORS allowlist is hardcoded to `http://localhost:5173` and
`http://localhost:3000`, plus the origin of `FRONTEND_URL`. Requests with no
`Origin` header (curl, Postman) are allowed through.

---

## 5. Auth model — read this before touching anything auth-related

Two ways in, both ending in the same 24h JWT (payload `{ id, role }`) stored in
`localStorage` under the key `token`:

**A. Local password login** — `POST /api/auth/login`, bcrypt compare.
`POST /api/auth/register` exists but **hard-codes `role = 'user'`** and ignores
any client-supplied role. This is intentional (a privilege-escalation fix); do
not "restore" role acceptance on that endpoint.

**B. Google OAuth 2.0 / OIDC**, a four-hop dance:

1. Browser hits `GET /api/auth/google` → 302 to the Google consent screen.
2. Google → `GET /api/auth/google/callback?code=...`. The backend exchanges the
   code at `oauth2.googleapis.com/token` and verifies the `id_token` via
   `tokeninfo`.
3. The backend looks the user up by `google_id`, else links by `email`
   (**preserving the existing DB role** — never upgrading it), else creates a new
   user with role `user`. It mints the JWT, stores it in the `auth_codes` table
   keyed by a `crypto.randomUUID()`, and redirects to
   `FRONTEND_URL/admin/login/callback?code=<uuid>`.
4. `src/pages/LoginCallback.jsx` POSTs that code to `/api/auth/google/token`,
   which runs `DELETE ... RETURNING jwt` — **single-use by construction**.

When `NODE_ENV=test`, step 2 is short-circuited by a fixed table of mock codes
(`mock-admin-code`, `mock-instructor-code`, `mock-new-code`,
`mock-existing-user-code`) so tests never hit Google.

**Authorization**: `requireAuth` verifies the JWT and then **re-reads the user
row from Postgres**, putting it on `req.user`. The role used for access
decisions is the DB role, not the token claim — a demoted user loses access
immediately. `requireRole(['admin'])` gates the write endpoints.

Frontend guard: `AdminRoute` in `src/App.jsx` — redirects to `/admin/login` when
logged out, renders an "Unauthorized" panel when logged in but not admin.

### Roles

The live set is **`user` / `instructor` / `admin`**, default `user`.
`schema.sql`, `seed.sql` and `migrations/001_google_auth.sql` now agree on this;
`student` is a retired role that migration 001 folds into `user`. The seed
account `student@workspace.edu` keeps its address for continuity but holds the
`user` role.

Only `admin` has write access. `instructor` currently has no capability that
`user` lacks — it exists in the constraint for future use.

---

## 6. API surface

Public (no auth):

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/google              -> 302 Google
GET    /api/auth/google/callback     -> 302 frontend with ?code
POST   /api/auth/google/token        { code } -> { token }
GET    /api/projects                 project_ideas rows (software-grid comparison)
GET    /api/projects/matrix          responsibility matrix  ** HARDCODED, see below **
GET    /api/projects/team            team members           ** HARDCODED, see below **
GET    /api/stages                   milestone timeline, ordered by order_number
GET    /api/stages/:id
GET    /api/versions                 changelog (snake_case -> camelCase mapped)
GET    /api/releases                 publications + their files
GET    /api/activities               activity feed
GET    /api/files/:id                302 to the file URL — intentionally public
```

Authenticated:

```
GET    /api/auth/me                  requireAuth
```

Admin-only (`requireAuth` + `requireRole(['admin'])`):

```
POST   /api/releases                 publish (big transaction, 6.1)
PATCH  /api/releases/:id             edit a published release (6.3)
DELETE /api/releases/:id             delete a release everywhere (6.2)
PATCH  /api/stages/:id/complete      status -> 'Completed'
POST   /api/files/upload             multipart, field name "file"
DELETE /api/files/:path(*)           remove an orphaned staged file from storage
```

`GET /api/files/:id` is deliberately unauthenticated: `<img>`, `<iframe>` and
`<object>` cannot send an `Authorization` header. Don't "fix" this by adding
`requireAuth` without also changing how `DocumentPreview.jsx` loads assets.

**Hardcoded data warning**: `getResponsibilityMatrix` and `getTeamMembers` in
`backend/src/controllers/projectController.js` return literal JS arrays — the
`responsibility_matrix` and `project_members` tables exist but are never read.
Changing the team or the matrix means editing that controller.

### 6.1 Publishing a release (`publishRelease`)

The centerpiece of the app. One `BEGIN … COMMIT` writing **five** tables:

1. Validate: all fields present; version matches `/^v\d+\.\d+(\.\d+)?$/`; the
   optional commit SHA is exactly 7 hex chars.
2. The author is taken from the DB user row (`users.name`), **not** from the
   request body — a client-supplied `author` is ignored.
3. Reject a duplicate `version` (409) and a duplicate stage name (400, case- and
   whitespace-insensitive).
4. Insert `publications` (plus a canned 9-step `pipeline` JSON that the UI
   animates).
5. Insert one `publication_files` row per asset, writing the generated id back
   onto the asset object.
6. Insert a `project_versions` changelog row.
7. Insert a **new** `stages` row with status `In Progress` and
   `order_number = MAX+1`; its id is `stage-<timestamp>-<random>`.
8. Insert an `activities` row.

On any failure: `ROLLBACK` **and** `cleanupUploadedFiles(assets)`, which deletes
the already-staged physical files from the storage provider. Errors return a
generic message — DB internals are never leaked to the client.

### 6.2 Deleting a release (`deleteRelease`)

Uses the shared `resolvePublication(client, id)` helper, which accepts three id
shapes — `stage-<id>`, `pub-<n>`, or a raw numeric id — and resolves any of them
to `{ version, projectId, pubId }` (or null for a 404). From the `version`, then inside a transaction deletes from
`project_versions`, `stages`, `activities` and `publications` (which cascades to
`publication_files`), **renumbers `order_number` across all remaining stages**,
and only *after* COMMIT deletes the physical files from storage.

### 6.3 Editing a release (`updateRelease`)

Because publishing denormalises the same facts across four tables, an edit has to
update every copy in one transaction or the pages contradict each other. Given a
title, stage name, change summary and optional commit SHA it updates
`publications` (title, changes), `project_versions` (change_summary, commit_sha),
`stages` (name, summary, changes, commit_sha, details) and the `activities` row so
the feed does not keep showing a title that no longer exists.

Two deliberate constraints:

- **The version tag is not editable.** It is the key joining all four tables, so
  renaming it would mean cascading the rename everywhere. Change it only by
  deleting and republishing.
- **Assets are not editable.** Adding or removing files on a published release is
  not implemented; `publication_files` and `assets_count` are untouched.

The duplicate-stage-name check excludes stages belonging to this same version, so
saving a release without renaming it is allowed. Editing preserves the stage id,
so the `/journey/<stage-id>` URL survives an edit — unlike delete-and-republish,
which mints a new id and drops the uploaded files.

---

## 7. File storage

`backend/src/services/storage/index.js` picks an implementation from
`STORAGE_PROVIDER` at import time. All implementations expose
`uploadFile(localPath, filename, mimeType) -> objectKey`, `getFileUrl(key)`,
`deleteFile(key)` and `fileExists(key)`.

- **LocalStorageService** — multer has already written the file to
  `backend/uploads/`; returns `/uploads/<filename>`, served statically by Express.
- **SupabaseStorageService** — uploads to a bucket under
  `publications/<timestamp>/<rand>-<name>`, deletes the local temp copy, and
  returns **1-hour signed URLs** from `getFileUrl`.
- **R2StorageService** — Cloudflare R2 via the S3 SDK, 15-minute presigned URLs.
  Needs `R2_ACCOUNT_ID` (or `R2_ENDPOINT`), `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`.

An unrecognised `STORAGE_PROVIDER` logs a warning and falls back to local disk.

Upload constraints (multer, `fileController.js`): **50 MB**, an extension
allowlist of `.pdf .ppt .pptx .png .jpg .jpeg .svg .mp4 .md .markdown`, and
filenames sanitized (`[^a-zA-Z0-9.\-_]` → `_`) and prefixed with `Date.now()`.

---

## 8. Frontend conventions

- **All server state lives in `AppContext`.** On mount it fires seven GETs in
  parallel (`Promise.all`, each with `.catch(() => [])`) into
  `versions / publications / activities / stages / teamMembers /
  responsibilityMatrix / projectIdeas`. Every mutation (`publishRelease`,
  `deletePublication`, `markStageComplete`, `login`) calls
  `loadDatabaseRecords()` again to resync. There is no optimistic update, no
  cache and no pagination. A new mutation should re-sync the same way.
- Components consume it via `useApp()`; theme via `useTheme()`.
- **Never call `fetch` from a component** — add a method to `src/services/api.js`.
  It attaches the bearer token and unwraps `{ error }` bodies into thrown `Error`s.
- Routes (`src/App.jsx`, `<Router basename="/ARMS">`):
  `/`, `/journey`, `/journey/:id`, `/planning`, `/versions`, `/team`,
  `/design-system` (a live token/primitive showcase), `/admin/login`,
  `/admin/login/callback`, `/release-control` (admin-guarded), and `*` → redirect
  to `/`.
- **The Planning page is temporarily disabled.** `src/pages/Planning.jsx` and its
  content file `src/data/planning.js` are intact, but four call sites are
  commented out with a `TEMPORARILY DISABLED` marker: the import and `<Route>` in
  `App.jsx`, the nav link in `Navbar.jsx`, and the footer link in `Footer.jsx`.
  `/planning` now falls through the catch-all to `/`. Restoring the page means
  uncommenting those four spots — nothing else. It is coming back, so do not
  delete either file.
- **The Team page** shows name, role and technical skills only. The Responsibility
  Matrix section and the `primaryResponsibility` / `currentTask` / `currentFocus` /
  `currentSprint` fields were all removed by request. Team content is
  hand-maintained in `backend/src/controllers/projectController.js` (the array in
  `getTeamMembers`), so `Team.jsx` tolerates missing `initials` (derives them from
  the name), `color`, `role` and `technicalSkills` rather than rendering a broken
  card. Note the live alwaysdata backend holds its own copy of that file — editing
  it there is what changes the deployed page.
- **Team members are sorted alphabetically by name in `AppContext`**, at the point
  the API response is stored — not in each page. That keeps the Team page, the
  homepage roster and the global search consistent no matter what order the
  backend returns. Do not re-sort in a component; if the ordering rule changes,
  change it in `loadDatabaseRecords`.
- The GitHub repository URL is the `REPO_URL` constant at the top of `Navbar.jsx`,
  used by both the desktop icon and the mobile menu entry.
- The other `src/data/*.js` fixtures (legacy copies from before the backend
  existed) have been deleted. Server data comes from the API only.
- The biggest and most delicate components: `pages/ReleaseControl.jsx` (~640
  lines: drag-drop staging, validation, publish pipeline animation) and
  `components/ui/DocumentPreview.jsx` (~320 lines: pdf/image/markdown/video
  viewer).

---

## 9. Tests

```bash
npm test                # frontend, from repo root
cd backend && npm test  # backend
```

Current state: **5 frontend tests, 37 backend tests, all passing.**

The backend test scripts pin `STORAGE_PROVIDER=local` so the suite never reaches
a real Supabase or R2 bucket, regardless of what `backend/.env` says. Keep that
pin on any new test script.

**Backend tests hit a real Postgres.** `backend/tests/globalSetup.js` runs
`DROP DATABASE IF EXISTS semester_portal_test; CREATE DATABASE ...`, applies
`database/schema.sql`, and seeds three users (admin / instructor / user), one
project and four stages. Both `globalSetup.js` and `setup.js` contain a **safety
guard that calls `process.exit(1)` unless `DATABASE_URL` ends with
`/semester_portal_test`** — never point the backend test command at a real
database. `fileParallelism: false`, because the suites share that one database.

Backend coverage: auth (login, JWT rejection), googleAuth (OAuth flow, role
preservation, role gates returning 401/403), release (admin-only, validation,
atomicity, rollback), delete (cascade integrity), stage (status rules,
admin-only PATCH), file (round-trip upload/retrieve for each allowed extension).

Frontend `src/tests/frontend.test.jsx` mocks `../context/AppContext` and
`react-router-dom`'s `useParams` wholesale, then asserts on Login, Navbar,
ReleaseControl and JourneyDetails — including that non-admins never see admin
controls. `src/tests/setup.js` stubs `window.matchMedia`, which ThemeContext
needs.

---

## 10. Build and deploy

- `npm run build` → `dist/`. `vite.config.js` sets `base: '/ARMS/'` and an
  `@` → `/src` alias.
- `.github/workflows/deploy.yml` builds, copies `dist/index.html` to
  `dist/404.html` (the SPA fallback for Pages), touches `.nojekyll`, and
  publishes to GitHub Pages on push to `main`/`master`.
- **The `/ARMS/` base appears in two places** — `base` in `vite.config.js` and
  `basename` on `<Router>` in `src/App.jsx`. Change both together or routing
  breaks.
- The backend is *not* deployed by CI; it runs separately (the frontend's
  fallback API URL points at an alwaysdata host).

---

## 11. Known rough edges (verify before "fixing" — some may be deliberate)

Deliberate, leave alone:

- `/api/projects/matrix` and `/api/projects/team` return hardcoded arrays. This
  was an intentional change (see commit `bdf55c6`), not an oversight.
- `GET /api/files/:id` is public on purpose (section 6).
- `POST /api/auth/register` ignores any client-supplied role on purpose (section 5).

Genuinely loose ends:

- The `responsibility_matrix` and `project_members` tables are unused (section 6),
  and since the Team page stopped rendering the matrix, `/api/projects/matrix` has
  no consumer either. The endpoint and its `AppContext` fetch are deliberately left
  in place so the section can be restored without rewiring anything.
- `instructor` is a role with no privileges attached to it yet.
- `.superbrain/` holds notes from a previous tool; it is gitignored.
- `backend/check-auth.mjs` is a throwaway script that verifies the seeded admin
  bcrypt hash; it is not part of the app.
- The seed passwords in `database/seed.sql` are local-dev bcrypt hashes only
  (`admin@workspace.edu` / `admin123`, and so on). They are not real secrets and
  must never be carried to a deployed environment.

Recently repaired — do not reintroduce:

- CI passed `node-size` instead of `node-version` to `actions/setup-node`, so the
  pinned Node 20 was silently ignored.
- `login` called `bcrypt.compare` against a NULL `password_hash`, so password
  login against an OAuth-only account threw and returned 500 instead of 401.
- Google auth codes had no TTL and were never purged; the table accumulated rows
  holding live 24h session tokens indefinitely. They now expire after 5 minutes,
  and stale rows are swept on each redemption attempt.
- Multer rejections (bad extension, oversized upload) reached the global error
  boundary with no status and surfaced as a generic 500; `fileRoutes.js` now maps
  them to 400/413 with the real reason.
- `deleteRelease` ran storage cleanup inside the try block *after* COMMIT, so a
  storage failure triggered a meaningless ROLLBACK and reported a successful
  deletion as a 500.
- The backend suite inherited `STORAGE_PROVIDER` from `backend/.env` and uploaded
  test fixtures to the real Supabase bucket, so `npm test` failed on any machine
  without network access to it.
- `R2StorageService` was written but never reachable from the storage factory.

---

## 12. Working rules for an agent on this repo

1. Match the surrounding style: ESM everywhere, `async/await`, raw parameterised
   SQL (`$1, $2`) — **always parameterised, never string-interpolated**.
2. Multi-table writes go inside `db.pool.connect()` with
   `BEGIN`/`COMMIT`/`ROLLBACK`, and `client.release()` in a `finally`.
3. Error responses: 4xx may carry a human-readable message; 5xx must stay
   generic. `server.js`'s error boundary enforces this — don't bypass it.
4. A new endpoint means: controller + route + mount in `server.js`, then an
   `api.js` method, then wiring through `AppContext` if the UI needs it.
5. A new UI value means: add a token in the `index.css` `@theme` block, then use
   the generated class.
6. Anything that writes data must be gated by `requireRole(['admin'])` unless
   there is a stated reason otherwise.
7. Schema changes go in a **new numbered file** under `database/migrations/`
   *and* into `database/schema.sql` — the test harness builds from `schema.sql`
   alone, so a migration-only change will not be exercised by backend tests.
8. Run both test suites before declaring work done; the backend suite needs a
   running local Postgres.
