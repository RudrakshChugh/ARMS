export const initialVersions = [
  {
    version: "v1.2",
    date: "Aug 14, 2026",
    author: "Manya Kedia",
    changeSummary: "Revised architecture specs, added detailed entity relationship models, and completed backend router templates.",
    commit: "a82fc21",
    deployment: "Production",
    filesChanged: ["src/db/schema.sql", "src/routes/api.js", "docs/planning-v2.md"],
    added: [
      "Added db/migrations directory for schema versioning.",
      "Added authentication middleware tests and routes validation logic."
    ],
    removed: [
      "Removed legacy session configuration in favor of JWT authentication."
    ],
    modified: [
      "Updated planning architecture diagram schema layouts.",
      "Optimized query connections pool configurations."
    ]
  },
  {
    version: "v1.1",
    date: "Aug 08, 2026",
    author: "Aarav Sharma",
    changeSummary: "Completed initial UI layout mapping, standard design token definitions, and UI button primitives.",
    commit: "9c8b7a6",
    deployment: "Staging",
    filesChanged: ["src/index.css", "src/components/ui/Button.jsx", "src/components/ui/Card.jsx"],
    added: [
      "Added Button, Card, Badge, and Input UI primitive components.",
      "Created design token color schema inside css rules."
    ],
    removed: [],
    modified: [
      "Refined main index layout rendering wrapper."
    ]
  },
  {
    version: "v1.0",
    date: "Aug 02, 2026",
    author: "Manya Kedia",
    changeSummary: "Initial project creation, folder structures setup, and Planning V1 baseline document publication.",
    commit: "f1a2b3c",
    deployment: "Production",
    filesChanged: ["package.json", "vite.config.js", "docs/planning-v1.md", "README.md"],
    added: [
      "Initialized Vite React project repository.",
      "Published Software Grid decision matrix.",
      "Published functional and non-functional requirements catalog."
    ],
    removed: [],
    modified: []
  }
];
