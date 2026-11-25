// Authoritative project data sourced from the UCS503 Final Project Report:
// "NOVA: Assessment-Quality Platform" — Team ARMS (Team ID: 4), Subgroup 3Q15, Nov 2026.

export const NOVA_META = {
  shortName: 'NOVA',
  title: 'NOVA: Assessment-Quality Platform',
  subtitle: 'Blueprint Compliance, Multi-Signal Novelty Auditing, and Reviewer-Adapted Question Bank Platform',
  course: 'UCS503: Software Engineering Lab',
  teamName: 'Team ARMS',
  teamId: '4',
  subgroup: '3Q15',
  program: 'B.E. Computer Engineering (5th Semester)',
  institution: 'Thapar Institute of Engineering and Technology, Patiala',
  instructor: 'Sukhpal Singh',
  submissionDate: 'November 2026',
  testedVersion: 'v1.0',
  releaseDate: 'Nov 24, 2026',
  novaRepoUrl: 'https://github.com/RudrakshChugh/NOVA',
  novaLiveUrl: 'https://nova.rudrakshchugh005.workers.dev/',
  portalRepoUrl: 'https://github.com/RudrakshChugh/ARMS',
  deploymentTopology: 'Cloudflare Worker (Frontend CDN) + Render Cloud Docker (FastAPI) + Neon Serverless PostgreSQL (pgvector)',
  deploymentNote:
    'Live web client deployed on Cloudflare Workers (https://nova.rudrakshchugh005.workers.dev/) with FastAPI backend packaged via Dockerfile / render.yaml and Neon pgvector.'
};

export const NOVA_PROBLEMS = [
  {
    id: 'drift',
    title: 'Blueprint Drift',
    description:
      'Questions drift away from the accredited Bloom cognitive level planned in the exam specification—for example, a row requiring Analyze is answered by a simple Recall definition.'
  },
  {
    id: 'repetition',
    title: 'Novelty Failure (PYQ Repetition)',
    description:
      'Past-year examination questions are accidentally reused verbatim, paraphrased, or repeated with only numerical constants altered because manual cross-checking across multi-year archives is infeasible.'
  },
  {
    id: 'hallucination',
    title: 'Ungrounded Generative Hallucination',
    description:
      'Generic LLM chat tools generate fluent questions covering concepts absent from the taught syllabus without verifiable citations or page-level provenance.'
  }
];

export const NOVA_USERS = [
  {
    role: 'Course Coordinator',
    scope: 'Course-scoped',
    responsibilities:
      'Uploads syllabus PDFs/DOCX and past papers, freezes immutable blueprints, manages course access, and exports exam papers and answer keys.'
  },
  {
    role: 'Exam Paper Setter / Reviewer',
    scope: 'Course-scoped',
    responsibilities:
      'Runs grounded question generation, inspects compliance checks and cited passages, edits or accepts/rejects candidates, and publishes to the bank.'
  }
];

export const NOVA_OBJECTIVES = [
  'Ingest multi-page PDF and DOCX course material into overlapping 5-sentence passages (stride 3) with 384-d ONNX embeddings and page provenance.',
  'Maintain versioned, immutable assessment blueprints (Course Outcome, Concept, Bloom level, Marks, Question Type) locked against post-freeze edits.',
  'Provide a swappable LLM adapter layer (local Ollama qwen3:8b, Groq, Anthropic Claude) with automatic failover routing.',
  'Enforce six deterministic compliance rules and a bounded (budget = 2) error-feedback repair loop with zero LLM self-grading.',
  'Audit candidates against indexed past-year questions across four orthogonal signals (semantic, BM25, structural Jaccard, numerical set equivalence) via a calibrated logistic combiner.',
  'Present ranked candidates (LightGBM pairwise ranker) in a human-in-the-loop review workspace and publish accepted questions with full provenance to an exportable PDF bank.'
];

export const NOVA_SCOPE = {
  inScope: [
    'PDF/DOCX syllabus parsing with SHA-256 deduplication and page-span tracking',
    'Versioned blueprint drafting, mark/CO validation, and immutable freezing',
    'Top-5 pgvector retrieval and swappable LLM generation with failover',
    '6 deterministic compliance checks + bounded 2-attempt repair loop',
    '4-signal PYQ novelty auditing (logistic duplicate threshold 0.4881)',
    'LightGBM reviewer preference ranking and human accept/edit/reject workflow',
    'Immutable question bank snapshots and ReportLab PDF paper + answer-key export'
  ],
  outOfScope: [
    'Online exam delivery, student logins, or student-facing interfaces',
    'Automated grading of student answer scripts or biometric proctoring',
    'Examination timetabling or institutional ERP/LMS gradebook replacement',
    'OCR ingestion for image-only scanned PDFs without an embedded text layer',
    'Scheduled automatic retraining of the reviewer ranker'
  ]
};

export const NOVA_USP_PILLARS = [
  {
    number: '01',
    title: 'Deterministic Rules, Zero Self-Grading',
    detail:
      'The LLM never evaluates its own output. Six plain-Python rule checks inspect leading imperative Bloom cues, question type/MCQ options, mark-to-word length bands, concept terms, CO terms, and verbatim quote overlap (floor 0.25) in under 5 ms.'
  },
  {
    number: '02',
    title: 'Bounded Error-Feedback Repair Loop',
    detail:
      'Rule violations are formatted with the exact mismatch (e.g., expected Bloom level or word-count band) and sent back to the LLM within a hard budget of 2 repair attempts so runs always terminate.'
  },
  {
    number: '03',
    title: 'Four-Signal Novelty Auditing',
    detail:
      'Combines all-MiniLM-L6-v2 cosine similarity, Okapi BM25 lexical overlap, structural clause Jaccard, and numerical set equality via a calibrated logistic regression meta-model (threshold 0.4881).'
  },
  {
    number: '04',
    title: 'Reviewer-Adapted LightGBM Ranker',
    detail:
      'Trained on historical accept, edit, and reject judgments (plus edit distance and review latency) to surface the strongest candidates at the top of the review queue.'
  },
  {
    number: '05',
    title: 'Verifiable Word-for-Word Grounding',
    detail:
      'Every candidate records character-span citations pointing to indexed syllabus passages and page ranges; cited quotes must appear verbatim in the referenced chunk.'
  }
];

export const NOVA_BID_CANDIDATES = [
  {
    id: 'idea-1',
    title: 'NOVA',
    subtitle: 'Assessment-Quality Platform (Blueprint Compliance, Novelty Auditing & Question Bank)',
    tag: '1st Choice · Approved',
    is_primary: true,
    description:
      'Enterprise assessment engineering platform generating syllabus-grounded exam questions under deterministic Bloom/mark constraints, 4-signal PYQ novelty auditing, and human-in-the-loop review.',
    problem:
      'Manual paper setting under Outcome-Based Education suffers from Bloom blueprint drift, accidental past-year question repetition, and ungrounded hallucinations.',
    target_audience:
      'Course Coordinators, Faculty Paper Setters / Reviewers, and Department Accreditation Auditors (no student accounts).',
    technical_stack: [
      'Python 3.14 + FastAPI',
      'React 19 + Vite',
      'PostgreSQL + pgvector',
      'ONNX Runtime (all-MiniLM-L6-v2)',
      'LightGBM + Okapi BM25',
      'Ollama / Claude / Groq'
    ],
    risk_mitigation:
      'In-process ONNX CPU embeddings fit within 512 MB hosting limits; FailoverRouter switches from local Ollama to cloud LLM adapters automatically.'
  },
  {
    id: 'idea-2',
    title: 'VeriClaim',
    subtitle: 'Scientific Claim Checker (Multi-Agent Evidence Retrieval & Verification)',
    tag: '2nd Choice',
    is_primary: false,
    description:
      'Decomposes scientific and medical assertions into atomic claims, retrieves literature from PubMed and Semantic Scholar, and evaluates NLI sentence-level evidence stance.',
    problem:
      'False health and scientific claims spread quickly because verifying peer-reviewed literature requires domain training and time.',
    target_audience: 'Researchers, fact-checkers, and general readers validating medical/scientific claims.',
    technical_stack: ['LangGraph Multi-Agent', 'PubMed & Semantic Scholar APIs', 'NLI Stance Classifier'],
    risk_mitigation: 'Self-critique verification check ensuring conclusions match retrieved peer-reviewed abstracts.'
  },
  {
    id: 'idea-3',
    title: 'Depgraph',
    subtitle: 'Dependency Vulnerability Graph and Safe Upgrade Planner',
    tag: '3rd Choice',
    is_primary: false,
    description:
      'Parses package lockfiles (npm, pip, cargo), queries OSV/NVD CVE databases, and computes minimal-breakage upgrade paths across the global dependency DAG.',
    problem:
      'Single-package alerts miss transitive compatibility conflicts when patching CVEs across large repositories.',
    target_audience: 'Software maintainers and DevSecOps teams managing multi-package dependencies.',
    technical_stack: ['Python NetworkX', 'Lockfile Parsers', 'OSV / NVD CVE Feeds'],
    risk_mitigation: 'Generates automated PRs with blast-radius graph risk analysis before applying upgrades.'
  },
  {
    id: 'idea-4',
    title: 'SecretGuard',
    subtitle: 'Secret Leak Detection and Auto-Rotation Platform',
    tag: '4th Choice',
    is_primary: false,
    description:
      'Listens to Git webhooks with high-entropy secret scanning and invokes cloud provider SDKs to revoke and rotate leaked credentials within seconds.',
    problem:
      'Passive leak alerts leave a dangerous manual remediation window after accidental credential commits.',
    target_audience: 'Engineering teams and cloud security administrators.',
    technical_stack: ['Git Webhooks', 'Entropy Scanner', 'AWS / GCP / GitHub Rotation SDKs'],
    risk_mitigation: 'Immutable rotation audit log paired with automated configuration patching.'
  }
];

export const NOVA_COMPARISON_MATRIX = {
  columns: ['NOVA (Approved)', 'VeriClaim', 'Depgraph', 'SecretGuard'],
  rows: [
    {
      metric: 'Departmental Need & Relevance',
      values: [
        'Direct TIET / OBE exam-setting need every semester',
        'General external media fact-checking',
        'Developer tooling / CVE management',
        'Cloud DevSecOps incident response'
      ]
    },
    {
      metric: 'Deterministic Verification',
      values: [
        '6 fixed rule checks + 4-signal calibrated novelty',
        'Relies heavily on NLI model stance judgments',
        'Deterministic DAG + CVE matching',
        'Regex/entropy heuristics + cloud SDK state'
      ]
    },
    {
      metric: 'End-to-End Course Demo Feasibility',
      values: [
        'High — demonstrated live on UCS503 syllabus & PYQs',
        'Medium — dependent on external literature API limits',
        'Medium — synthetic repo breakages needed for demo',
        'Low — requires live cloud credential revocation demos'
      ]
    },
    {
      metric: 'Architecture & ML Depth',
      values: [
        'Full-stack + pgvector + ONNX + LLM failover + LightGBM',
        'Multi-agent LangGraph + NLI retrieval',
        'Graph algorithms + package parsers',
        'Webhook listeners + cloud SDK orchestration'
      ]
    }
  ]
};

export const NOVA_TECH_STACK = [
  {
    layer: 'Frontend Client',
    technology: 'React 19 + Vite (ESM)',
    details: '~360 KB unminified bundle (~105 KB gzipped), responsive ink-and-shadow UI, 6-step guided workflow, keyboard-driven Reviewer Workspace (J / K / A / E / R), oxlint static checks.'
  },
  {
    layer: 'API Gateway & Auth',
    technology: 'Python 3.14 + FastAPI + Uvicorn + Pydantic v2',
    details: '12 domain routers, automatic OpenAPI docs, Google OIDC / OAuth 2.0, HttpOnly/Secure/SameSite=Lax JWT cookies, course-level RBAC via scoping.py.'
  },
  {
    layer: 'Embeddings & Retrieval',
    technology: 'ONNX Runtime + all-MiniLM-L6-v2 + pgvector',
    details: 'In-process 384-d CPU inference (AVX2/AVX-512, ~18 ms/chunk, fits 512 MB RAM budget); HNSW vector_cosine_ops retrieval in ~14.2 ms over indexed chunks.'
  },
  {
    layer: 'LLM Generation Layer',
    technology: 'Ollama (qwen3:8b) / Anthropic Claude / Groq',
    details: 'Strategy pattern (BaseLLMAdapter) with FailoverRouter automatic fallback, JSON schema enforcement, seed/temperature/prompt-hash reproducibility tracking.'
  },
  {
    layer: 'Auditing & Ranking ML',
    technology: 'Deterministic Rule Engine + Logistic Combiner + LightGBM',
    details: '6 rule checks (<5 ms), 4 novelty signals (cosine, Okapi BM25, clause Jaccard, numerical set equality) with threshold 0.4881, and pairwise LightGBM ranker.'
  },
  {
    layer: 'Persistence & Export',
    technology: 'PostgreSQL 16 + pgvector + SQLAlchemy + psycopg 3 + ReportLab',
    details: '26 relational/vector tables (14 core ERD entities), TLS-enforced Neon cloud Postgres, ReportLab PDF renderer for exam papers & separate coordinator answer keys.'
  }
];

export const NOVA_ARCHITECTURE_TRADEOFFS = [
  {
    decision: 'Deterministic Python Rules vs. LLM Self-Grading',
    choice: 'Deterministic Rule Functions',
    rationale:
      'Eliminates LLM sycophancy and evaluation drift; runs 6 rule checks in ~3.1 ms per candidate with 100% reproducible, auditable violation messages.'
  },
  {
    decision: 'In-Process ONNX Embeddings vs. External Embedding API',
    choice: 'Local ONNX Runtime (all-MiniLM-L6-v2)',
    rationale:
      'Removes per-token billing and network round-trips (~18 ms/chunk), prevents syllabus data exfiltration, and runs with zero GPU inside 512 MB RAM.'
  },
  {
    decision: 'Unified PostgreSQL + pgvector vs. Dedicated Vector DB',
    choice: 'PostgreSQL + pgvector HNSW',
    rationale:
      'Eliminates dual-database sync bugs, guarantees transactional foreign-key integrity between materials and chunks, and simplifies hosting to one DB.'
  },
  {
    decision: '4-Signal Novelty Combiner vs. Single Cosine Threshold',
    choice: 'Logistic Regression over 4 Orthogonal Signals',
    rationale:
      'Dense cosine alone misses numerical substitutions while BM25 misses synonym paraphrasing; combining semantic, BM25, structural, and numerical signals catches both.'
  },
  {
    decision: 'LightGBM Pairwise Ranker vs. Deep Neural Ranker',
    choice: 'LightGBM Gradient-Boosted Ranker',
    rationale:
      'Fits on sparse tabular review records in <1.2 s and delivers sub-millisecond queue ordering without GPU requirements.'
  }
];

export const NOVA_API_ENDPOINTS = [
  { method: 'POST', route: '/api/auth/google', router: 'auth.py', scope: 'Public', payload: 'Google OAuth auth code', response: '200 OK (Set Session Cookie)' },
  { method: 'GET', route: '/api/auth/me', router: 'auth.py', scope: 'Authenticated', payload: 'Session Cookie', response: '200 OK (User Identity JSON)' },
  { method: 'POST', route: '/api/materials', router: 'materials.py', scope: 'Coordinator', payload: 'Multipart PDF/DOCX, course_id', response: '201 Created (chunk_count)' },
  { method: 'GET', route: '/api/materials/{course_id}', router: 'materials.py', scope: 'Member', payload: 'course_id UUID', response: '200 OK (Materials List)' },
  { method: 'POST', route: '/api/blueprints', router: 'blueprints.py', scope: 'Coordinator', payload: 'BlueprintCreate schema', response: '201 Created (blueprint_id)' },
  { method: 'POST', route: '/api/blueprints/{id}/rows', router: 'blueprints.py', scope: 'Coordinator', payload: 'CO, Bloom, marks, type, concept', response: '201 Created (row_id)' },
  { method: 'POST', route: '/api/blueprints/{id}/freeze', router: 'blueprints.py', scope: 'Coordinator', payload: 'blueprint_id', response: '200 OK (status="frozen")' },
  { method: 'POST', route: '/api/runs', router: 'runs.py', scope: 'Reviewer / Coord', payload: 'RunCreate (blueprint_id)', response: '201 Created (run_id)' },
  { method: 'GET', route: '/api/runs/{id}/stream', router: 'runs.py', scope: 'Member', payload: 'run_id UUID', response: '200 OK (Live Log Stream)' },
  { method: 'GET', route: '/api/reviews/queue', router: 'reviews.py', scope: 'Reviewer', payload: 'course_id UUID', response: '200 OK (Ranked Candidates)' },
  { method: 'POST', route: '/api/reviews/{id}', router: 'reviews.py', scope: 'Reviewer', payload: 'decision (accept/edit/reject)', response: '200 OK (Updated Queue)' },
  { method: 'GET', route: '/api/bank/{course_id}', router: 'bank.py', scope: 'Member', payload: 'Filter query params', response: '200 OK (Published Bank)' },
  { method: 'GET', route: '/api/papers/{course_id}/export', router: 'papers.py', scope: 'Member', payload: 'format (pdf / latex)', response: '200 OK (Binary PDF / LaTeX)' },
  { method: 'POST', route: '/api/pyqs', router: 'pyqs.py', scope: 'Coordinator', payload: 'Multipart PDF / questions', response: '201 Created (Indexed PYQs)' },
  { method: 'POST', route: '/api/evaluation/ablate', router: 'evaluation.py', scope: 'Admin', payload: 'arm_name, sample_size', response: '200 OK (Ablation Metrics)' },
  { method: 'GET', route: '/api/system/health', router: 'system.py', scope: 'Public', payload: 'None', response: '200 OK (Status & LLM Health)' }
];

export const NOVA_DB_ENTITIES = [
  { name: 'users & role_changes', purpose: 'Google OIDC identities with platform standing (pending, member, admin) and immutable audit trail of every role change.' },
  { name: 'courses & course_members', purpose: 'Multi-tenant course registry and scoped coordinator/reviewer memberships enforced by scoping.py.' },
  { name: 'materials & chunks', purpose: 'SHA-256 deduplicated course files split into 5-sentence sliding windows (stride 3) with page ranges and vector(384) HNSW embeddings.' },
  { name: 'blueprints & blueprint_rows', purpose: 'Versioned exam specifications (CO, concept, Bloom level, marks, question type) locked immutably once frozen.' },
  { name: 'generation_runs & candidates', purpose: 'Reproducible run metadata (model, seed, temperature, prompt hash) and staged candidates with JSONB citations and 6-check compliance reports.' },
  { name: 'past_papers, past_paper_questions & novelty_pairs', purpose: 'Historical PYQ corpus indexed for 4-signal duplicate detection and labelled pairs for logistic meta-model fitting.' },
  { name: 'review_records & questions', purpose: 'Accept/edit/reject decisions, edit distance, and latency for LightGBM training, plus immutable published question bank snapshots.' }
];

export const NOVA_SETUP_GUIDE = {
  prerequisites: [
    'Python 3.14+ (64-bit)',
    'Node.js 20+ LTS & npm',
    'PostgreSQL 16+ with pgvector extension enabled',
    'Docker Engine 24+ (for containerized build/deploy)',
    'Minimum 4 CPU cores, 8 GB RAM (16 GB recommended if running local Ollama qwen3:8b)',
    'Optional: Ollama local daemon or Anthropic Claude / Groq API key + Google OAuth client credentials'
  ],
  installSteps: [
    { step: '1. Clone Repository', cmd: 'git clone https://github.com/RudrakshChugh/NOVA.git && cd NOVA' },
    { step: '2. Create Python Virtual Env & Install Backend', cmd: 'python -m venv .venv && .venv\\Scripts\\activate && pip install -r backend/requirements.txt' },
    { step: '3. Fetch ONNX Embedding Model & Seed Dev DB', cmd: 'python backend/scripts/fetch_embedding_model.py && python backend/scripts/dev_db.py' },
    { step: '4. Start FastAPI Backend (from backend/)', cmd: 'cd backend && uvicorn app.main:app --port 8000' },
    { step: '5. Start React 19 Frontend (from frontend/)', cmd: 'cd frontend && npm install && npm run dev' }
  ],
  cicdPipeline: [
    { stage: 'Automated Regression CI', detail: 'GitHub Actions / pre-commit checks execute pytest backend/tests/ (229 tests / 38 integration functions), oxlint frontend checks, and Pydantic v2 schema consistency checks within 90 seconds.' },
    { stage: 'Docker Packaging', detail: 'Multi-stage Dockerfile based on python:3.14-slim installs Python dependencies, pre-downloads all-MiniLM-L6-v2 ONNX weights into the image, builds the Vite SPA, and launches Uvicorn.' },
    { stage: 'Cloud Deployment Blueprint', detail: 'Render Cloud (render.yaml with sync: false secrets) hosts the FastAPI container; Neon Serverless PostgreSQL hosts relational + pgvector storage over SSL TCP:5432; Cloudflare Worker (wrangler.jsonc) serves static SPA assets globally.' }
  ]
};

export const NOVA_SCREENS = [
  {
    id: 'screen-1',
    number: 'Screen 1',
    title: 'Institute Google OAuth Sign-In',
    summary: 'Single @thapar.edu Google OIDC login gate with four platform guarantees; new accounts enter as pending until admitted by an administrator (no self-signup).'
  },
  {
    id: 'screen-2',
    number: 'Screen 2',
    title: 'Course Material Upload & Passage Indexing',
    summary: 'Dual-track ingestion for syllabus PDFs/DOCX and past-year papers. Displays DB counts (1 file indexed, 42 passages across 26 pages, 384-d MiniLM ONNX embeddings, 5-sentence window / stride 3).'
  },
  {
    id: 'screen-3',
    number: 'Screen 3',
    title: 'Blueprint Definition & Immutable Freezing',
    summary: 'Version 1 frozen blueprint locked against edits, showing 6 constraint rows totaling 28 marks across CO1 & CO2 (Remember MCQ, Short Answer, Apply, Analyze 10-mark Long Answer, Evaluate).'
  },
  {
    id: 'screen-4',
    number: 'Screen 4',
    title: 'Generation Run, Readiness & Reproducibility',
    summary: '4-stage run panel (Retrieve -> Draft -> Audit -> Repair) with LLM readiness check, optional soft preference input, and run table logging model (qwen3:8b via Ollama), seed, temperature, and prompt hash.'
  },
  {
    id: 'screen-5',
    number: 'Screen 5',
    title: 'Reviewer Workspace with Checks & Sources',
    summary: 'Keyboard-driven triage queue (J/K/A/E/R) displaying candidate stem, MCQ options, constraint metadata, per-check pass/fail tiles, novelty tab, verbatim cited syllabus passages, and draft history.'
  },
  {
    id: 'screen-6',
    number: 'Screen 6',
    title: 'Auditing Engines & Fitted Novelty Model',
    summary: 'Inspects the 4-signal logistic novelty model (coefficients, intercept, 0.4881 threshold) and LightGBM ranker status. Prototype view showed 15 PYQs (1 year) and 72 labelled pairs (placeholder coefficients vs 300+ pair target).'
  },
  {
    id: 'screen-7',
    number: 'Screen 7',
    title: 'Immutable Question Bank with Provenance',
    summary: 'Stores reviewer-accepted questions with version tag, Bloom level, marks, compliance status, and full provenance drawer (run ID, blueprint version, cited chunks, and approving reviewer).'
  },
  {
    id: 'screen-8',
    number: 'Screen 8',
    title: 'Evaluation Harness & Seven Pinned Arms',
    summary: 'Configurable multi-seed ablation harness comparing the full NOVA system against baselines and engine ablations (7 arms x N seeds). Shown empty on the CS101 prototype blueprint prior to the UCS503 study.'
  }
];

export const NOVA_TEST_STRATEGIES = [
  { level: 'Unit Testing', target: 'compliance.py, embeddings.py, novelty/signals.py, auth.py', framework: 'Pytest 9.1 + Pytest-Mock', criteria: '100% pass rate in < 3.0s without DB dependencies.' },
  { level: 'System & Integration', target: 'test_e2e.py, test_generation_pipeline.py, test_novelty_pipeline.py', framework: 'FastAPI TestClient (HTTPX) + PostgreSQL/pgvector', criteria: 'Full upload -> chunk -> blueprint -> generate -> audit -> publish slice with HTTP 200/201.' },
  { level: 'Performance & Stress', target: 'pgvector retrieval, ONNX embedder, API pool', framework: 'Locust / concurrent HTTP benchmarks', criteria: 'P95 vector retrieval < 25 ms over 10k chunks; ONNX < 20 ms/chunk.' },
  { level: 'Faculty UAT', target: '4 CSED faculty reviewers', framework: 'Blinded 50 NOVA vs 50 manual past questions', criteria: 'Cohen’s Kappa >= 0.75, acceptance >= 85%, usability >= 4.5/5.' },
  { level: 'Branch Coverage', target: 'ComplianceEngine, repair loop, scoping.py', framework: 'Coverage.py (pytest --cov=backend/app)', criteria: 'Branch coverage >= 88%; 100% branch coverage on rule checks.' },
  { level: 'CI Regression', target: '38 integration checks + oxlint + Pydantic v2', framework: 'GitHub Actions / pre-commit runners', criteria: 'Zero regressions; pipeline completes in <= 90s.' },
  { level: 'Live Beta Field Test', target: 'Render Web Service + Neon PostgreSQL', framework: 'UCS503 Fall 2026 (4 PDFs, 120 pages, 10-row blueprint)', criteria: 'Live paper generation & PDF export with zero unhandled 500s.' }
];

export const NOVA_TEST_CASES = [
  { id: 'TC-01', feature: 'PDF Ingestion & Sentence Chunking', req: 'FR-2 / UC-01', env: 'Linux x86_64 / Python 3.14', input: 'SE_Unit1_ProcessModels.pdf (24 pages, 480 KB)', latency: '1.48 s', outcome: 'PASS (112 chunks, 384-d)', artifact: 'test_uploads.py::test_pdf_chunking' },
  { id: 'TC-02', feature: 'Blueprint Constraint Validation', req: 'FR-3 / UC-02', env: 'FastAPI / Pydantic v2', input: 'Valid Apply/5-mark row vs Invalid InventBogus/0-mark row', latency: '4.2 ms', outcome: 'PASS (201 vs 422)', artifact: 'test_syllabus.py::test_blueprint_validation' },
  { id: 'TC-03', feature: 'Top-K Vector Retrieval Scoping', req: 'FR-1, FR-2 / UC-03', env: 'PostgreSQL / pgvector', input: 'Query across UCS503 (112 chunks) vs UCS401 (80 chunks)', latency: '14.2 ms', outcome: 'PASS (0 cross-course leaks)', artifact: 'test_scoping.py::test_course_isolation' },
  { id: 'TC-04', feature: 'LLM Adapter JSON Generation', req: 'FR-4 / UC-03', env: 'Ollama (8B)', input: 'Top-5 passages, CO1, Understand, 5 marks', latency: '1.82 s', outcome: 'PASS (Valid JSON schema)', artifact: 'test_generation_pipeline.py::test_adapter' },
  { id: 'TC-05', feature: 'Deterministic Compliance Rules', req: 'FR-4 / UC-04', env: 'In-Process Rule Engine', input: 'Compliant Understand draft vs mismatched Apply draft', latency: '3.1 ms', outcome: 'PASS (100% rule precision)', artifact: 'test_outcomes.py::test_bloom_matching' },
  { id: 'TC-06', feature: 'Automated Error Repair Loop', req: 'FR-4 / UC-04', env: 'Orchestrator (budget=2)', input: 'Initial 12-word draft (expected 20–250 for 5 marks)', latency: '3.12 s', outcome: 'PASS (Repaired to 74 words)', artifact: 'test_generation_hardening.py::test_repair' },
  { id: 'TC-07', feature: '4-Signal Novelty Detection', req: 'FR-5 / UC-04', env: 'BM25 + ONNX MiniLM', input: 'Paraphrased Agile principles question vs 95 PYQs', latency: '28.5 ms', outcome: 'PASS (p=0.842 > 0.4881)', artifact: 'test_novelty_pipeline.py::test_duplicate' },
  { id: 'TC-08', feature: 'Reviewer Decision & Bank Immutability', req: 'FR-5 / UC-05', env: 'PostgreSQL Transaction', input: 'POST /reviews/{id} accept + immutable bank check', latency: '8.4 ms', outcome: 'PASS (No PUT/PATCH on bank)', artifact: 'test_reviews.py::test_publish' },
  { id: 'TC-09', feature: 'LLM Provider Failover Routing', req: 'FR-4 / UC-03', env: 'FailoverRouter', input: 'Simulated Ollama 503 -> Anthropic Claude fallback', latency: '1.66 s', outcome: 'PASS (22 ms catch, 0 crashes)', artifact: 'test_e2e.py::test_failover' },
  { id: 'TC-10', feature: 'Exam Paper & Answer Key PDF Export', req: 'FR-5 / UC-05', env: 'ReportLab / Jinja2', input: 'GET /papers/{course_id}/export?format=pdf (50 marks)', latency: '410 ms', outcome: 'PASS (Student vs Key PDFs)', artifact: 'test_papers.py::test_latex_export' }
];

export const NOVA_DEFECT_LOG = [
  {
    id: 'BUG-01',
    title: 'Bloom Cue Tie-Breaking Ambiguity',
    defect: 'Questions beginning with "Explain how..." triggered an Apply match due to the substring "how" instead of Understand.',
    fix: 'Refined BLOOM_CUES matching to evaluate exact leading imperative n-grams with priority ordering.',
    retest: 'Verified 100% precision in test_outcomes.py.'
  },
  {
    id: 'BUG-02',
    title: 'PDF Table Chunk Token Overflow',
    defect: 'Dense syllabus tables created multi-sentence chunks exceeding the 512-token ONNX window, emitting truncation warnings.',
    fix: 'Added pre-tokenization length clamping in services/ingestion.py.',
    retest: 'Zero truncation warnings across all 120 ingested UCS503 pages.'
  },
  {
    id: 'BUG-03',
    title: 'Scoping Check Null Pointer on Pending Users',
    defect: 'Unadmitted (pending) users requesting blueprint lists raised an AttributeError instead of HTTP 403.',
    fix: 'Hardened require_course_member() in backend/app/scoping.py to reject pending standing before role dereferencing.',
    retest: 'Clean HTTP 403 Forbidden returned and verified.'
  }
];

export const NOVA_ABLATION_RESULTS = [
  { arm: 'Arm 1 · Full NOVA (All Engines + Repair Loop)', compliance: '94.2%', ci: '[92.1%, 96.3%]', duplicateLeakage: '0.0%', latency: '2.14s (Claude) / 4.82s (Ollama)', notes: '100% passed grounding floor (>0.85); 0 duplicate admissions.' },
  { arm: 'Arm 2 · Ablation 1 (No Repair Loop)', compliance: '72.4%', ci: '[68.9%, 75.9%]', duplicateLeakage: '0.0%', latency: '1.65s (Claude)', notes: '-21.8 pp drop proves bounded error-feedback repair drives compliance.' },
  { arm: 'Arm 3 · Ablation 2 (No Novelty Filter)', compliance: '81.0%', ci: '[78.2%, 83.8%]', duplicateLeakage: '14.8%', latency: '2.05s (Claude)', notes: 'Admitted 14.8% duplicate/near-duplicate PYQs into review queue.' },
  { arm: 'Arm 4 · Baseline (Zero-Shot Direct Prompt)', compliance: '38.5%', ci: '[34.3%, 42.7%]', duplicateLeakage: 'Unchecked', latency: '1.40s (Claude)', notes: 'Frequent Bloom drift, ungrounded concepts, and mark-band failures (p < 0.001).' }
];

export const NOVA_UAT_METRICS = [
  { label: 'Inter-Rater Agreement', value: 'k = 0.78', detail: 'Cohen’s Kappa across 4 CSED faculty reviewers (50 NOVA vs 50 past questions).' },
  { label: 'Unedited Acceptance Rate', value: '88.0%', detail: 'Faculty accepted 88.0% of NOVA-generated questions without stem edits.' },
  { label: 'Authoring Latency Reduction', value: '68.4%', detail: 'Dropped from 18.5 min/question manually to 5.8 min/question with NOVA.' },
  { label: 'Code Coverage (v1.0)', value: '91.8% / 88.4%', detail: '91.8% line coverage, 88.4% branch coverage (ComplianceEngine 98.2%).' }
];

export const NOVA_HONEST_DISCLOSURES = [
  {
    category: 'Evaluation Harness UI Snapshot (Screen 8)',
    status: 'Explicitly Disclosed',
    detail:
      'Section 2.5 and Screen 8 (Figure 26) state that while the 7-arm evaluation harness is built into the software, a study had not yet been triggered via the UI on the CS101 prototype blueprint; Section 6.1 reports the UCS503 100-run evaluation benchmarks separately.'
  },
  {
    category: 'Novelty Pair Dataset Size (Screen 6)',
    status: 'Prototype Floor',
    detail:
      'In Figure 24 (Screen 6), the CS101 prototype workspace displays 15 past questions (1 paper/year) and 72 labelled pairs with placeholder weights active, below the 300+ multi-year pair target noted in the UI.'
  },
  {
    category: 'Scanned PDF / Image-Only Syllabi',
    status: 'Known Limitation',
    detail:
      'PyPDF extraction requires PDFs/DOCX with an embedded Unicode text layer; scanned image-only documents require external OCR before ingestion.'
  },
  {
    category: 'Local Inference Latency',
    status: 'Hardware Bound',
    detail:
      'Running local open-weight Ollama models (qwen3:8b) on a 4-CPU node averages ~4.82 s/question compared to ~2.14 s via Anthropic Claude API.'
  },
  {
    category: 'Automatic Ranker Retraining',
    status: 'Out of Current Scope',
    detail:
      'Review records are persisted continuously, but scheduled background retraining of the LightGBM ranker is manual/deferred to future work.'
  }
];

export const NOVA_ITERATIONS = [
  {
    iteration: 'Iteration 1 · Quantitative Mark Bands',
    change: 'Removed subjective difficulty labels (easy/medium/hard) that faculty found unenforceable; replaced with deterministic answer word-count bands (MARK_BANDS) tied to mark allocation.'
  },
  {
    iteration: 'Iteration 2 · Error-Feedback Repair Loop',
    change: 'Replaced passive rejection of non-compliant drafts with a bounded 2-attempt repair loop injecting exact violation reasons, lifting compliance from 72.4% to 94.2%.'
  },
  {
    iteration: 'Iteration 3 · 4-Signal Novelty Calibration',
    change: 'Upgraded single-metric vector similarity to a 4-signal combiner (cosine + BM25 + clause Jaccard + numerical set equality) to catch both paraphrasing and altered numbers.'
  },
  {
    iteration: 'Iteration 4 · Reviewer-Adapted LightGBM Ranker',
    change: 'Added pairwise learning-to-rank trained on faculty accept/edit/reject judgments and edit distance so higher-quality candidates surface first.'
  }
];

export const NOVA_FUTURE_WORK = [
  'Multi-modal diagram question generation (UML and architecture prompts with automated SVG/Mermaid rendering).',
  'Item Response Theory (IRT) calibration using post-exam student performance data for empirical difficulty/discrimination.',
  'Automated multi-tier grading rubrics and marking scheme breakdowns for long subjective answers.',
  'Direct LMS Learning Tools Interoperability (LTI 1.3) packaging for native embedding inside Canvas and Moodle.'
];

export const NOVA_REFERENCES = [
  '[1] IEEE Computer Society, "IEEE Recommended Practice for Software Requirements Specifications," IEEE Std 830-1998.',
  '[2] L. W. Anderson and D. R. Krathwohl, A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom\'s Taxonomy, 2001.',
  '[3] National Board of Accreditation (NBA), "Self Assessment Report (SAR) for Accreditation of Undergraduate Engineering Programs," 2021.',
  '[4] P. Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS, vol. 33, 2020.',
  '[5] S. Robertson and H. Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond," FnTIR, vol. 3, no. 4, 2009.',
  '[6] S. Ke et al., "LightGBM: A Highly Efficient Gradient Boosting Decision Tree," NeurIPS, vol. 30, 2017.',
  '[7] J. Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding," NAACL-HLT, 2019.',
  '[8] Reimers & Gurevych, "Sentence-BERT" / all-MiniLM-L6-v2 & ONNX Runtime (https://onnxruntime.ai).',
  '[9] pgvector Contributors, "Open-source vector similarity search for PostgreSQL," 2024 (https://github.com/pgvector/pgvector).',
  '[10] S. Ramírez et al., "FastAPI Framework," 2024 (https://fastapi.tiangolo.com).',
  '[11] J. Cohen, "A Coefficient of Agreement for Nominal Scales," Educational and Psychological Measurement, 1960.',
  '[12] B. Efron & R. J. Tibshirani, An Introduction to the Bootstrap, 1993.'
];

export const NOVA_TEAM_MEMBERS = [
  {
    id: 'akshat',
    name: 'Akshat',
    rollNumber: '1024170128',
    role: 'Architectural & Core Backend Lead',
    technicalSkills: ['Python 3.14', 'FastAPI', 'PostgreSQL', 'pgvector', 'ONNX Runtime', 'Docker'],
    initials: 'AK',
    color: '#B8863B',
    contribution: 'FastAPI gateway, PyPDF sliding chunker, ONNX all-MiniLM-L6-v2 embeddings, PostgreSQL + pgvector, and Docker packaging.'
  },
  {
    id: 'manya',
    name: 'Manya Kedia',
    rollNumber: '1024170130',
    role: 'Compliance Engine & Security Lead',
    technicalSkills: ['Python', 'Compliance Engine', 'RBAC / OIDC', 'PostgreSQL', 'IEEE 830 SRS'],
    initials: 'MK',
    color: '#49796B',
    contribution: '6-check deterministic compliance engine, bounded repair loop, Claude adapter, course-level RBAC scoping, and SRS.'
  },
  {
    id: 'rudraksh',
    name: 'Rudraksh Chugh',
    rollNumber: '1024170133',
    role: 'Novelty Engine & Persistence Lead',
    technicalSkills: ['Python', 'Okapi BM25', 'scikit-learn', 'Logistic Calibration', 'ReportLab PDF', 'pgvector'],
    initials: 'RC',
    color: '#3F7D58',
    contribution: '4-signal PYQ novelty engine, calibrated logistic duplicate model, historical PYQ indexing, and ReportLab PDF export.'
  },
  {
    id: 'sneha',
    name: 'Sneha Choudhary',
    rollNumber: '1024170147',
    role: 'Frontend & Quality Assurance Lead',
    technicalSkills: ['React 19', 'Vite', 'LightGBM Ranker', 'Pytest 9.1', 'Coverage.py'],
    initials: 'SC',
    color: '#7B68EE',
    contribution: 'React 19 SPA & Reviewer Workspace, LightGBM preference ranker, Pytest test suite, and ablation harness.'
  }
];

export const NOVA_STAGES = [
  {
    id: 'stage-1',
    name: 'P1 · Bid Selection & Scope',
    date: 'Aug 10, 2026',
    status: 'Completed',
    owner: 'Team ARMS',
    version: 'v0.1',
    commit_sha: '1a4c9e2',
    summary:
      'Evaluated four candidate engineering systems (NOVA, VeriClaim, Depgraph, SecretGuard) and received instructor approval for NOVA: Assessment-Quality Platform.',
    changes:
      'Defined OBE problem boundaries, stakeholder profiles (Course Coordinator, Reviewer, Admin), 14-week WBS schedule, and zero self-grading governance constraints.',
    assets: [
      {
        type: 'markdown',
        name: 'Project_Bid_and_Scope.md',
        path: '#bid-scope',
        content:
          '### NOVA Project Bid & Scope\nSelected 1st Choice after UCS503 bid defense.\n- Target: Faculty examination paper authoring under OBE.\n- Core Pillars: Deterministic 6-check compliance, bounded repair loop, 4-signal PYQ novelty, LightGBM ranking, and verbatim syllabus grounding.\n- Out of scope: Student sign-in, online testing, proctoring, and OCR for scanned images.'
      }
    ]
  },
  {
    id: 'stage-2',
    name: 'P2 · Software Grid & IEEE 830 SRS',
    date: 'Sep 14, 2026',
    status: 'Completed',
    owner: 'Manya Kedia',
    version: 'v0.2',
    commit_sha: '3b7d10f',
    summary:
      'Compared candidate project proposals in the Software Grid Matrix and authored the IEEE 830 SRS, five Use Cases (UC-01–UC-05), User Stories (US-01–US-05), and DFD Levels 0–2.',
    changes:
      'Specified FR-1 through FR-5, non-functional latency/security targets, and bidirectional Requirement Traceability Matrix (RTM).',
    assets: []
  },
  {
    id: 'stage-3',
    name: 'P3 · Architecture, UML & Vector Pipeline',
    date: 'Sep 28, 2026',
    status: 'Completed',
    owner: 'Akshat',
    version: 'v0.3',
    commit_sha: '5e8a42c',
    summary:
      'Completed 4-tier architecture, 8 UML diagrams (Class, Sequence, Collaboration, Statecharts, Component, Deployment, ERD), pgvector schema, and React 19 shell.',
    changes:
      'Implemented PyPDF/DOCX ingestion with 5-sentence sliding window (stride 3), ONNX Runtime all-MiniLM-L6-v2 384-d embeddings, and immutable blueprint freezing.',
    assets: [
      {
        type: 'markdown',
        name: 'Architecture_and_Ingestion_Summary.md',
        path: '#arch-summary',
        content:
          '### P3 Architecture & Ingestion Milestone\n- Presentation: React 19 + Vite SPA (~360 KB / ~105 KB gzipped) on Cloudflare Worker.\n- API Gateway: Python 3.14 + FastAPI + Pydantic v2 + scoping.py.\n- Embeddings: Local ONNX Runtime all-MiniLM-L6-v2 (384-d, ~18 ms/chunk).\n- Persistence: PostgreSQL + pgvector HNSW cosine index (<15 ms top-k retrieval).'
      }
    ]
  },
  {
    id: 'stage-4',
    name: 'P4 · Compliance Rules, Repair & Failover',
    date: 'Oct 14, 2026',
    status: 'Completed',
    owner: 'Manya Kedia',
    version: 'v0.4',
    commit_sha: '7c21b09',
    summary:
      'Built the 6-check deterministic ComplianceEngine (BLOOM_CUES, MARK_BANDS, type, concept, CO, verbatim quote >= 0.25 floor) and 2-attempt repair loop.',
    changes:
      'Replaced subjective difficulty with word-length bands; added Anthropic Claude and Groq adapters alongside Ollama via FailoverRouter.',
    assets: [
      {
        type: 'markdown',
        name: 'Compliance_and_Repair_Loop.md',
        path: '#compliance-summary',
        content:
          '### Deterministic Compliance & Repair\n- 6 independent Python checks (~3.1 ms/candidate).\n- Bounded error-feedback repair loop (max 2 attempts).\n- Lifted blueprint compliance from 72.4% (no repair) to 94.2% (full NOVA).'
      }
    ]
  },
  {
    id: 'stage-5',
    name: 'P5 · 4-Signal Novelty, Ranker & PDF Export',
    date: 'Nov 11, 2026',
    status: 'Completed',
    owner: 'Rudraksh Chugh & Sneha Choudhary',
    version: 'v0.5',
    commit_sha: '9f44d81',
    summary:
      'Integrated the 4-signal PYQ Novelty Engine (threshold 0.4881), LightGBM reviewer preference ranker, ReportLab exam/key PDF export, and 7-arm evaluation harness.',
    changes:
      'Indexed 95 historical UCS503 PYQs, trained logistic novelty combiner, and built keyboard-driven Reviewer Workspace.',
    assets: [
      {
        type: 'markdown',
        name: 'Novelty_and_Ranker_Spec.md',
        path: '#novelty-spec',
        content:
          '### Novelty Auditing & Reviewer Ranking\n- 4 Signals: Cosine (MiniLM), Okapi BM25, Clause Jaccard, Numerical Set Equality.\n- Calibrated logistic threshold: 0.4881 (0% duplicate leakage in UCS503 ablation).\n- LightGBM pairwise ranker ordered candidate queue from review_records.'
      }
    ]
  },
  {
    id: 'stage-6',
    name: 'P6 · Verification, Cloud Deploy & Release v1.0',
    date: 'Nov 24, 2026',
    status: 'Completed',
    owner: 'Team ARMS',
    version: 'v1.0',
    commit_sha: 'b60e314',
    summary:
      'Completed 229-test Pytest suite (38 integration checks across TC-01–TC-10, 100% pass rate), 4-arm ablation study, faculty UAT, Docker/Render/Cloudflare config, and final report.',
    changes:
      'Resolved BUG-01 through BUG-03, verified 91.8% line / 88.4% branch coverage, and finalized UCS503 end-semester deliverables.',
    assets: [
      {
        type: 'markdown',
        name: 'Release_v1_Verification_Summary.md',
        path: '#v1-verification',
        content:
          '### Final Release v1.0 Verification\n- Pytest suite: 229 tests; 10 formal integration cases (TC-01 to TC-10) passing.\n- Coverage: 91.8% line, 88.4% branch (ComplianceEngine 98.2%).\n- UCS503 Evaluation: 94.2% compliance vs 38.5% zero-shot baseline; 68.4% authoring latency reduction (18.5m -> 5.8m).'
      }
    ]
  }
];

export const NOVA_VERSIONS = [
  {
    version: 'v1.0',
    date: 'Nov 24, 2026',
    author: 'Team ARMS',
    commit: 'b60e314',
    changeSummary:
      'Final submission release: 229-test Pytest suite passing (91.8% line / 88.4% branch coverage), Docker + Render + Cloudflare deployment configs, UCS503 ablation study, and final report.',
    filesChanged: ['Dockerfile', 'render.yaml', 'wrangler.jsonc', 'backend/tests/*', 'frontend/src/*'],
    added: [
      'Verified 10 formal integration test cases (TC-01–TC-10) and resolved BUG-01–BUG-03.',
      'Completed 4-arm bootstrap ablation study (94.2% compliance) and 4-faculty UAT (k = 0.78).'
    ],
    modified: [
      'Hardened require_course_member() scoping for pending accounts (BUG-03).',
      'Added pre-tokenization chunk clamping to prevent 512-token ONNX truncation (BUG-02).'
    ],
    removed: []
  },
  {
    version: 'v0.5',
    date: 'Nov 11, 2026',
    author: 'Sneha Choudhary & Rudraksh Chugh',
    commit: '9f44d81',
    changeSummary:
      'Integrated LightGBM reviewer preference ranker, ReportLab examination paper & answer-key PDF export, and 7-arm evaluation harness.',
    filesChanged: ['backend/app/services/ranker.py', 'backend/app/services/paper_pdf.py', 'backend/app/routers/evaluation.py'],
    added: [
      'Pairwise LightGBM ranker trained on faculty accept/edit/reject decisions and edit distance.',
      'Separate student exam PDF and coordinator-only answer key PDF export via ReportLab.'
    ],
    modified: ['Reviewer Workspace keyboard navigation and provenance drawer.'],
    removed: []
  },
  {
    version: 'v0.4',
    date: 'Oct 28, 2026',
    author: 'Rudraksh Chugh',
    commit: '8a19c30',
    changeSummary:
      'Engineered 4-signal novelty auditing engine (semantic cosine, Okapi BM25, clause Jaccard, numerical set equality) and historical PYQ indexing.',
    filesChanged: ['backend/app/services/novelty/signals.py', 'backend/app/services/novelty/combiner.py', 'backend/app/routers/pyqs.py'],
    added: [
      'Calibrated logistic regression meta-model with 0.4881 duplicate threshold.',
      'Historical past-year paper parser and novelty comparison tab.'
    ],
    modified: ['Shortlist top-10 nearest historical questions before 4-signal scoring.'],
    removed: ['Replaced single cosine-only duplicate threshold.']
  },
  {
    version: 'v0.3',
    date: 'Oct 14, 2026',
    author: 'Manya Kedia',
    commit: '7c21b09',
    changeSummary:
      'Implemented 6 deterministic blueprint compliance rules, bounded 2-attempt repair loop, course-level scoping middleware, and Anthropic Claude adapter.',
    filesChanged: ['backend/app/services/compliance.py', 'backend/app/services/orchestrator.py', 'backend/app/scoping.py'],
    added: [
      'BLOOM_CUES leading imperative classifier and MARK_BANDS answer word-count validation.',
      'Verbatim citation grounding check with 0.25 cosine support floor.'
    ],
    modified: ['Updated orchestrator to re-prompt with exact violation messages on failure.'],
    removed: ['Removed subjective difficulty field (easy/medium/hard).']
  },
  {
    version: 'v0.2',
    date: 'Sep 28, 2026',
    author: 'Rudraksh Chugh & Sneha Choudhary',
    commit: '5e8a42c',
    changeSummary:
      'Added PostgreSQL pgvector integration, React 19 + Vite frontend shell, and immutable blueprint freezing.',
    filesChanged: ['backend/app/models.py', 'backend/app/routers/blueprints.py', 'frontend/src/App.jsx'],
    added: [
      'HNSW cosine index on 384-d chunk vectors in pgvector.',
      'Versioned blueprint freezing and revision copy workflow.'
    ],
    modified: ['Migrated in-memory drafts to persistent PostgreSQL tables.'],
    removed: []
  },
  {
    version: 'v0.1',
    date: 'Sep 14, 2026',
    author: 'Akshat',
    commit: '1a4c9e2',
    changeSummary:
      'Initial prototype: PyPDF ingestion, 5-sentence sliding chunking (stride 3), ONNX all-MiniLM-L6-v2 embedder, and Ollama adapter.',
    filesChanged: ['backend/app/services/ingestion.py', 'backend/app/services/embeddings.py', 'backend/app/services/llm_adapters.py'],
    added: [
      'SHA-256 duplicate file guard and page-span tracking.',
      'In-process ONNX Runtime CPU embedding pipeline.'
    ],
    modified: [],
    removed: []
  }
];

export const NOVA_ACTIVITIES = [
  { id: 'act-1', action: 'Released NOVA v1.0 with 229 passing Pytest tests and UCS503 ablation study', person: 'Team ARMS', timestamp: 'Nov 24, 2026', version: 'v1.0' },
  { id: 'act-2', action: 'Integrated LightGBM reviewer ranker & ReportLab exam PDF export', person: 'Sneha Choudhary & Rudraksh Chugh', timestamp: 'Nov 11, 2026', version: 'v0.5' },
  { id: 'act-3', action: 'Calibrated 4-signal PYQ novelty combiner (threshold 0.4881)', person: 'Rudraksh Chugh', timestamp: 'Oct 28, 2026', version: 'v0.4' },
  { id: 'act-4', action: 'Enforced 6-check deterministic compliance engine & 2-attempt repair loop', person: 'Manya Kedia', timestamp: 'Oct 14, 2026', version: 'v0.3' }
];
