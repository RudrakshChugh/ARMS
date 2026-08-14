export const timelineStages = [
  {
    id: "stage-1",
    name: "Idea Exploration",
    date: "Aug 10, 2026",
    status: "Completed",
    owner: "Manya Kedia",
    version: "v0.1",
    summary: "Brainstormed and filtered four distinct software project paths addressing university domain issues.",
    changes: "Initial project ideation. Defined target problems for laboratory tracking, peer code review, real-time code editor, and grade forecasting.",
    assets: [
      { type: "pdf", name: "Initial Brainstorming Log.pdf", path: "/docs/brainstorming.pdf" },
      { type: "markdown", name: "Brainstorming Notes.md", path: "/docs/brainstorming-notes.md", content: `### Idea Exploration Notes
We evaluated 4 candidate ideas based on the following criteria:
- Semester viability
- Testing surface area
- Engineering complexity

See the Software Grid for details.` }
    ],
    commit: "f1a2b3c",
    details: [
      "Assessed course requirements, resource availability, and tech stacks.",
      "Conducted brief user interviews with other students and faculty.",
      "Ranked ideas on system feasibility, novelty, and testing capabilities."
    ]
  },
  {
    id: "stage-2",
    name: "Software Grid",
    date: "Aug 18, 2026",
    status: "Completed",
    owner: "Aarav Sharma",
    version: "v0.5",
    summary: "Evaluated four candidate project configurations and selected CollabSync as the focus based on semester constraints.",
    changes: "Compared metrics for problem severity, novelty, database scaling, and integration risks.",
    assets: [
      { type: "pdf", name: "Software Proposal Matrix.pdf", path: "/docs/proposal-matrix.pdf" },
      { type: "image", name: "Software Grid Evaluation.png", path: "/docs/grid-eval.png" }
    ],
    commit: "d4e5f6a",
    details: [
      "Analyzed engineering complexities, integration dependencies, and security compliance.",
      "Published a complete 4-way comparison matrix of proposed systems.",
      "Finalized the project focus with primary user profiles and risk-mitigation fallback plans."
    ]
  },
  {
    id: "stage-3",
    name: "Planning V1",
    date: "Aug 26, 2026",
    status: "Completed",
    owner: "Manya Kedia",
    version: "v1.0",
    summary: "Formulated functional and non-functional requirements and mapped initial system architecture.",
    changes: "First formal release. Created functional specs table and non-functional guidelines.",
    assets: [
      { type: "pdf", name: "Planning Specifications V1.pdf", path: "/docs/planning-v1.pdf" }
    ],
    commit: "a82fc21",
    details: [
      "Authored 10 functional requirements and 6 non-functional requirements (NFRs).",
      "Drafted high-level system component definitions (Frontend, API, DB).",
      "Configured git branch rules, commit hooks, and static analysis tools."
    ]
  },
  {
    id: "stage-4",
    name: "Planning V2",
    date: "Sep 10, 2026",
    status: "In Progress",
    owner: "Rohan Varma",
    version: "v1.2",
    summary: "Comprehensive detailing of security controls, API endpoints, testing protocols, and mock schemas.",
    changes: "Refined relational schema, documented JWT auth workflow, added test automation rules.",
    assets: [
      { type: "pdf", name: "Architecture & Schema Specs.pdf", path: "/docs/architecture-specs.pdf" },
      { type: "image", name: "Database Schema V1.2.png", path: "/docs/schema-v1-2.png" },
      { type: "markdown", name: "API Routing Spec.md", path: "/docs/api-spec.md", content: `### API Routing Specification
Security policy: JWT verification required.
- \`POST /api/v1/auth/login\`
- \`GET /api/v1/projects\`
- \`POST /api/v1/projects/:id/sync\`` }
    ],
    commit: "9c8b7a6",
    details: [
      "Added detailed relational schema models and indexing strategy.",
      "Added complete API endpoints registry with validation rules.",
      "Identified and listed security controls including access rules and JWT token structures."
    ]
  },
  {
    id: "stage-5",
    name: "Mid Semester",
    date: "Oct 05, 2026",
    status: "Planned",
    owner: "Manya Kedia",
    version: "v1.5",
    summary: "Validation of core end-to-end user paths and schema integration check.",
    changes: "Beta prototype compile. Demonstrating standard WebSocket text synchronization.",
    assets: [
      { type: "pdf", name: "Midterm Prototype Report.pdf", path: "/docs/midterm-report.pdf" },
      { type: "video", name: "Sandbox Sync Demo.mp4", path: "/docs/midterm-demo.mp4" }
    ],
    commit: null,
    details: [
      "Demonstrate core functionality running in a containerized sandbox.",
      "Review milestones vs progress with course coordinator.",
      "Refine planning document based on initial user feedback."
    ]
  }
];
