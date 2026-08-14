export const teamMembers = [
  {
    id: "manya",
    name: "Manya Kedia",
    role: "Lead Systems Architect & PM",
    primaryResponsibility: "Relational database schema modeling, deployment configuration, and pipeline releases.",
    currentSprint: "Staging Pipeline Refinement",
    technicalSkills: ["PostgreSQL", "Docker", "Git Actions", "System Design", "Vite Compiler"],
    currentTask: "Configuring the automated publication pipeline validators inside the Release Control Center.",
    currentFocus: "Verifying multi-asset document browser integrations and state update routes.",
    initials: "MK",
    color: "#49796B"
  },
  {
    id: "aarav",
    name: "Aarav Sharma",
    role: "Frontend Engineer",
    primaryResponsibility: "State synchronization components, responsive views layout styling, and design token integration.",
    currentSprint: "Documentation UI Overhaul",
    technicalSkills: ["React", "Tailwind CSS v4", "Framer Motion", "Scrollspy Hook", "A11y ARIA"],
    currentTask: "Refactoring the scrollspy navigation panel and slideshow preview handlers.",
    currentFocus: "Extracting styling utilities into global tokens variables to prevent CSS duplication.",
    initials: "AS",
    color: "#3F7D58"
  },
  {
    id: "rohan",
    name: "Rohan Varma",
    role: "Backend & Security Engineer",
    primaryResponsibility: "Access control middleware APIs, secure storage, and testing frameworks.",
    currentSprint: "Access Credentials Audit",
    technicalSkills: ["Go REST API", "Redis Cache", "JSON Web Tokens", "Docker Sandbox", "JUnit testing"],
    currentTask: "Implementing JWT validation guards and mock data sandbox endpoints.",
    currentFocus: "Securing document file upload parameters from directory traversal bugs.",
    initials: "RV",
    color: "#B8863B"
  }
];

export const responsibilityMatrix = [
  { id: 1, area: "Frontend Framework & Tokens", primaryOwner: "Aarav Sharma", secondaryOwner: "Manya Kedia", status: "Completed" },
  { id: 2, area: "Backend API Framework", primaryOwner: "Rohan Varma", secondaryOwner: "Aarav Sharma", status: "Completed" },
  { id: 3, area: "Database Schema Modeling", primaryOwner: "Manya Kedia", secondaryOwner: "Rohan Varma", status: "Completed" },
  { id: 4, area: "Authentication & JWT Guards", primaryOwner: "Rohan Varma", secondaryOwner: "Manya Kedia", status: "In Progress" },
  { id: 5, area: "Staging & Production Deployment", primaryOwner: "Manya Kedia", secondaryOwner: "Rohan Varma", status: "Completed" },
  { id: 6, area: "Technical Planning Documentation", primaryOwner: "Manya Kedia", secondaryOwner: "Aarav Sharma", status: "In Progress" },
  { id: 7, area: "Security Auditing & Protection", primaryOwner: "Rohan Varma", secondaryOwner: "Manya Kedia", status: "In Progress" },
  { id: 8, area: "Unit & Automated Integration Testing", primaryOwner: "Rohan Varma", secondaryOwner: "Manya Kedia", status: "Planned" },
  { id: 9, area: "Project Management & Releases", primaryOwner: "Manya Kedia", secondaryOwner: "Aarav Sharma", status: "Completed" }
];
