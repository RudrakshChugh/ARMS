-- Local development seed values for UCS503 Portal
-- IMPORTANT: The passwords are LOCAL DEVELOPMENT ONLY (bcrypt hashed). Never use these in production settings.
-- admin123 hash: $2a$10$a1A6H/uQ2bV3nS6X7oJbNu/u6zM8qfT/N4bB/c8f2l8e1tKkLg6C2
-- inst123 hash: $2a$10$T1K7I6L1b2n3m4o5p6q7ru31L1zH/h1jG3C2n3V1W41yZ41wW4123
-- student123 hash: $2a$10$L0xP2.m0k0Q8W4/y1m027e31n0G2h31L3iR2n3W41yZ41wW41234

-- 1. Users
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Manya Kedia', 'admin@workspace.edu', '$2a$10$a1A6H/uQ2bV3nS6X7oJbNu/u6zM8qfT/N4bB/c8f2l8e1tKkLg6C2', 'admin'),
(2, 'Instructor Profile', 'instructor@workspace.edu', '$2a$10$T1K7I6L1b2n3m4o5p6q7ru31L1zH/h1jG3C2n3V1W41yZ41wW4123', 'instructor'),
(3, 'Aarav Sharma', 'student@workspace.edu', '$2a$10$L0xP2.m0k0Q8W4/y1m027e31n0G2h31L3iR2n3W41yZ41wW41234', 'student');

SELECT setval('users_id_seq', 3);

-- 2. Projects
INSERT INTO projects (id, name, description, created_by, is_primary) VALUES
(1, 'CollabSync', 'Real-time collaborative text code editor sandbox workspace.', 1, TRUE);

SELECT setval('projects_id_seq', 1);

-- 3. Project Members
INSERT INTO project_members (id, project_id, user_id, role) VALUES
(1, 1, 1, 'Lead Systems Architect & PM'),
(2, 1, 3, 'Frontend Developer');

SELECT setval('project_members_id_seq', 2);

-- 4. Project Journey Stages
INSERT INTO stages (id, project_id, name, date, status, owner, version, summary, changes, commit_sha, details, assets, order_number) VALUES
('stage-1', 1, 'Idea Exploration', 'Aug 10, 2026', 'Completed', 'Manya Kedia', 'v0.1', 
 'Brainstormed and filtered four distinct software project paths addressing university domain issues.',
 'Initial project ideation. Defined target problems for laboratory tracking, peer code review, real-time code editor, and grade forecasting.',
 'f1a2b3c',
 '["Assessed course requirements, resource availability, and tech stacks.", "Conducted brief user interviews with other students and faculty.", "Ranked ideas on system feasibility, novelty, and testing capabilities."]'::jsonb,
 '[{"type": "pdf", "name": "Initial Brainstorming Log.pdf", "path": "/docs/brainstorming.pdf"}, {"type": "markdown", "name": "Brainstorming Notes.md", "path": "/docs/brainstorming-notes.md", "content": "### Idea Exploration Notes\nWe evaluated 4 candidate ideas based on viability, testing surface area, and complexity. See the Software Grid."}]'::jsonb,
 1),

('stage-2', 1, 'Software Grid', 'Aug 18, 2026', 'Completed', 'Aarav Sharma', 'v0.5',
 'Evaluated four candidate project configurations and selected CollabSync as the focus based on semester constraints.',
 'Compared metrics for problem severity, novelty, database scaling, and integration risks.',
 'd4e5f6a',
 '["Analyzed engineering complexities, integration dependencies, and security compliance.", "Published a complete 4-way comparison matrix of proposed systems.", "Finalized the project focus with primary user profiles and risk-mitigation fallback plans."]'::jsonb,
 '[{"type": "pdf", "name": "Software Proposal Matrix.pdf", "path": "/docs/proposal-matrix.pdf"}, {"type": "image", "name": "Software Grid Evaluation.png", "path": "/docs/grid-eval.png"}]'::jsonb,
 2),

('stage-3', 1, 'Planning V1', 'Aug 26, 2026', 'Completed', 'Manya Kedia', 'v1.0',
 'Formulated functional and non-functional requirements and mapped initial system architecture.',
 'First formal release. Created functional specs table and non-functional guidelines.',
 'a82fc21',
 '["Authored 10 functional requirements and 6 non-functional requirements (NFRs).", "Drafted high-level system component definitions (Frontend, API, DB).", "Configured git branch rules, commit hooks, and static analysis tools."]'::jsonb,
 '[{"type": "pdf", "name": "Planning Specifications V1.pdf", "path": "/docs/planning-v1.pdf"}]'::jsonb,
 3),

('stage-4', 1, 'Planning V2', 'Sep 10, 2026', 'In Progress', 'Aarav Sharma', 'v1.2',
 'Comprehensive detailing of security controls, API endpoints, testing protocols, and mock schemas.',
 'Refined relational schema, documented JWT auth workflow, added test automation rules.',
 '9c8b7a6',
 '["Added detailed relational schema models and indexing strategy.", "Added complete API endpoints registry with validation rules.", "Identified and listed security controls including access rules and JWT token structures."]'::jsonb,
 '[{"type": "pdf", "name": "Architecture & Schema Specs.pdf", "path": "/docs/architecture-specs.pdf"}, {"type": "image", "name": "Database Schema V1.2.png", "path": "/docs/schema-v1-2.png"}, {"type": "markdown", "name": "API Routing Spec.md", "path": "/docs/api-spec.md", "content": "### API Routing Specification\nSecurity policy: JWT verification required.\n- POST /api/v1/auth/login\n- GET /api/v1/projects\n- POST /api/v1/projects/:id/sync"}]'::jsonb,
 4);

-- 5. Publications
INSERT INTO publications (id, project_id, version, date, author, title, changes, assets_count, pipeline) VALUES
(1, 1, 'v1.2', 'Aug 14, 2026', 'Manya Kedia', 'Architecture & Schema Specs', 'Revised entity relationship mappings and API schemas.', 3, 
 '[{"name": "Validation", "status": "Success", "timestamp": "Aug 14, 2026 14:32:01"}, {"name": "Metadata Extraction", "status": "Success", "timestamp": "Aug 14, 2026 14:32:05"}, {"name": "File Storage", "status": "Success", "timestamp": "Aug 14, 2026 14:32:12"}, {"name": "Version Creation", "status": "Success", "timestamp": "Aug 14, 2026 14:32:18"}, {"name": "Journey Update", "status": "Success", "timestamp": "Aug 14, 2026 14:32:25"}, {"name": "Homepage Update", "status": "Success", "timestamp": "Aug 14, 2026 14:32:31"}, {"name": "Activity Update", "status": "Success", "timestamp": "Aug 14, 2026 14:32:38"}, {"name": "Publication Complete", "status": "Success", "timestamp": "Aug 14, 2026 14:32:42"}]'::jsonb),
(2, 1, 'v1.1', 'Aug 08, 2026', 'Aarav Sharma', 'Software Grid Proposal', 'Completed evaluation metrics matrices.', 2, 
 '[{"name": "Validation", "status": "Success", "timestamp": "Aug 08, 2026 10:15:02"}, {"name": "Metadata Extraction", "status": "Success", "timestamp": "Aug 08, 2026 10:15:06"}, {"name": "File Storage", "status": "Success", "timestamp": "Aug 08, 2026 10:15:10"}, {"name": "Version Creation", "status": "Success", "timestamp": "Aug 08, 2026 10:15:15"}, {"name": "Journey Update", "status": "Success", "timestamp": "Aug 08, 2026 10:15:20"}, {"name": "Homepage Update", "status": "Success", "timestamp": "Aug 08, 2026 10:15:25"}, {"name": "Activity Update", "status": "Success", "timestamp": "Aug 08, 2026 10:15:30"}, {"name": "Publication Complete", "status": "Success", "timestamp": "Aug 08, 2026 10:15:35"}]'::jsonb),
(3, 1, 'v1.0', 'Aug 02, 2026', 'Manya Kedia', 'Planning Document V1.0', 'First formal publish containing baseline specifications.', 1, 
 '[{"name": "Validation", "status": "Success", "timestamp": "Aug 02, 2026 09:00:03"}, {"name": "Metadata Extraction", "status": "Success", "timestamp": "Aug 02, 2026 09:00:08"}, {"name": "File Storage", "status": "Success", "timestamp": "Aug 02, 2026 09:00:15"}, {"name": "Version Creation", "status": "Success", "timestamp": "Aug 02, 2026 09:00:22"}, {"name": "Journey Update", "status": "Success", "timestamp": "Aug 02, 2026 09:00:30"}, {"name": "Homepage Update", "status": "Success", "timestamp": "Aug 02, 2026 09:00:37"}, {"name": "Activity Update", "status": "Success", "timestamp": "Aug 02, 2026 09:00:43"}, {"name": "Publication Complete", "status": "Success", "timestamp": "Aug 02, 2026 09:00:48"}]'::jsonb);

SELECT setval('publications_id_seq', 3);

-- 6. Publication Files (Release files association)
INSERT INTO publication_files (id, publication_id, name, type, size, path) VALUES
(1, 1, 'Architecture_Specs.pdf', 'pdf', '1.2 MB', '/docs/architecture-specs.pdf'),
(2, 1, 'Database_Schema.png', 'image', '2.4 MB', '/docs/schema-v1-2.png'),
(3, 1, 'API_Routing_Spec.md', 'markdown', '12 KB', '/docs/api-spec.md'),
(4, 2, 'Software_Proposal_Matrix.pdf', 'pdf', '800 KB', '/docs/proposal-matrix.pdf'),
(5, 2, 'Grid_Evaluation.png', 'image', '1.1 MB', '/docs/grid-eval.png'),
(6, 3, 'Planning_Specs_V1.pdf', 'pdf', '1.5 MB', '/docs/planning-v1.pdf');

SELECT setval('publication_files_id_seq', 6);

-- 7. Project Versions
INSERT INTO project_versions (id, project_id, version, date, author, change_summary, commit_sha, files_changed, added, modified, removed) VALUES
(1, 1, 'v1.2', 'Aug 14, 2026', 'Manya Kedia', 'Revised architecture specs, added detailed entity relationship models, and completed backend router templates.', 'a82fc21', 
 '["src/db/schema.sql", "src/routes/api.js", "docs/planning-v2.md"]'::jsonb,
 '["Added db/migrations directory for schema versioning.", "Added authentication middleware tests and routes validation logic."]'::jsonb,
 '["Updated planning architecture diagram schema layouts.", "Optimized query connections pool configurations."]'::jsonb,
 '["Removed legacy session configuration in favor of JWT authentication."]'::jsonb),
(2, 1, 'v1.1', 'Aug 08, 2026', 'Aarav Sharma', 'Formulated project comparison grid matrices and suitability checklists.', 'd4e5f6a',
 '["docs/software-grid.md", "src/components/SoftwareGrid.jsx"]'::jsonb,
 '["Created comparative metrics matrices.", "Added risk-mitigation outline blocks."]'::jsonb,
 '["Updated problem definitions for university grade calculators."]'::jsonb,
 '[]'::jsonb),
(3, 1, 'v1.0', 'Aug 02, 2026', 'Manya Kedia', 'Completed core requirements baselining, branch security structures, and layout definitions.', 'a82fc21',
 '["docs/planning-v1.md", "src/App.jsx", "src/index.css"]'::jsonb,
 '["Added global CSS tokens design system variables.", "Created buttons, cards, selects, modals UI primitives."]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb);

SELECT setval('project_versions_id_seq', 3);

-- 8. Activities
INSERT INTO activities (id, action, person, timestamp, version, user_id) VALUES
(1, 'Published release v1.2: Architecture & Schema Specs', 'Manya Kedia', 'Aug 14, 2026 14:32', 'v1.2', 1),
(2, 'Released version v1.2', 'Manya Kedia', 'Aug 14, 2026 14:30', 'v1.2', 1),
(3, 'Published release v1.1: Software Grid Proposal', 'Aarav Sharma', 'Aug 08, 2026 10:15', 'v1.1', 3),
(4, 'Released version v1.1', 'Aarav Sharma', 'Aug 08, 2026 10:12', 'v1.1', 3),
(5, 'Published release v1.0: Planning Document V1.0', 'Manya Kedia', 'Aug 02, 2026 09:00', 'v1.0', 1);

SELECT setval('activities_id_seq', 5);

-- 9. Project Ideas (Software Grid details)
INSERT INTO project_ideas (id, title, subtitle, tag, description, problem, target_audience, technical_stack, risk_mitigation, is_primary) VALUES
('idea-1', 'LabLock', 'Automated Lab Access & Resource Allocation', 'Laboratory IoT System', 
 'A scheduling and occupancy broker managing hardware access keys, machine allocations, and safety checklist completions.',
 'Undergraduates experience resource lockouts due to chaotic email approvals, uncoordinated slots, and manual key collections.',
 'Lab administrators managing entry cards, student teams scheduling workspace hardware blocks.',
 '["Express REST APIs", "PostgreSQL schema mapping", "RFID IoT broker scripts"]'::jsonb,
 'Fallback to offline verification cards and manual key lock box grids.', FALSE),

('idea-2', 'PeerCode', 'Traceable Peer Code Review Audit Registry', 'Academic Engineering Tool',
 'A code inspection and submission matrix generating feedback loops on student code repos prior to final submissions.',
 'Class teaching assistants get overloaded with duplicate bugs, code style issues, and manual evaluation workflows.',
 'Course graders running static analysis and student pairs reviewing git branches.',
 '["React single page renders", "Docker sandbox compiler APIs", "Git Webhooks listener"]'::jsonb,
 'Allow offline text feedback lists if webhook server queues experience drops.', FALSE),

('idea-3', 'CollabSync', 'Browser Collaborative Editor Sandbox', 'Real-Time Workspace (Selected)',
 'A real-time workspace with text synchronization, sandbox execution containers, and milestone history logs.',
 'Student teams struggle to code cooperatively under high campus Wi-Fi latencies and missing compiler setups.',
 'Course grading coordinator reviewing builds, student pairs coding synchronously.',
 '["React + Tailwind tokens CSS", "Go WebSocket synchronize broker", "Docker sandbox compilers"]'::jsonb,
 'Fallback to local browser WebAssembly compiler engines if internet sync fails.', TRUE),

('idea-4', 'GradeWise', 'Relational Grade & Milestone Forecaster', 'Predictive Dashboard',
 'An academic tracking sheet plotting historical grade data, forecasting performance drop risks, and tracking course margins.',
 'Students lack visibility on weightage metrics, grade forecasting targets, and risk-mitigation fallback milestones.',
 'Advisors tracking performance warning signs, student developers calculating course scopes.',
 '["Express Node service", "Python forecasting models", "PostgreSQL database engines"]'::jsonb,
 'Provide manual weight calculators if database forecasting engines fail.', FALSE);

-- 10. Responsibility Matrix
INSERT INTO responsibility_matrix (id, area, primary_owner, secondary_owner, status) VALUES
(1, 'Frontend Framework & Tokens', 'Aarav Sharma', 'Manya Kedia', 'Completed'),
(2, 'Backend API Framework', 'Rohan Varma', 'Aarav Sharma', 'Completed'),
(3, 'Database Schema Modeling', 'Manya Kedia', 'Rohan Varma', 'Completed'),
(4, 'Authentication & JWT Guards', 'Rohan Varma', 'Manya Kedia', 'In Progress'),
(5, 'Staging & Production Deployment', 'Manya Kedia', 'Rohan Varma', 'Completed'),
(6, 'Technical Planning Documentation', 'Manya Kedia', 'Aarav Sharma', 'In Progress'),
(7, 'Security Auditing & Protection', 'Rohan Varma', 'Manya Kedia', 'In Progress'),
(8, 'Unit & Automated Integration Testing', 'Rohan Varma', 'Manya Kedia', 'Planned'),
(9, 'Project Management & Releases', 'Manya Kedia', 'Aarav Sharma', 'Completed');

SELECT setval('responsibility_matrix_id_seq', 9);
