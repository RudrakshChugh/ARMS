import db from '../config/db.js';

export const getProjects = async (req, res) => {
  try {
    const ideasRes = await db.query('SELECT * FROM project_ideas ORDER BY id ASC');
    res.json(ideasRes.rows);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};

export const getResponsibilityMatrix = async (req, res) => {
  try {
    const matrix = [
      { id: 1, area: "Frontend Framework & Tokens", primaryOwner: "Rudraksh", secondaryOwner: "Akshat", status: "Completed" },
      { id: 2, area: "Backend API Framework", primaryOwner: "Sneha Choudhary", secondaryOwner: "Rudraksh", status: "Completed" },
      { id: 3, area: "Database Schema Modeling", primaryOwner: "Manya Kedia", secondaryOwner: "Sneha Choudhary", status: "Completed" },
      { id: 4, area: "Authentication & JWT Guards", primaryOwner: "Sneha Choudhary", secondaryOwner: "Manya Kedia", status: "In Progress" },
      { id: 5, area: "Staging & Production Deployment", primaryOwner: "Manya Kedia", secondaryOwner: "Rudraksh", status: "Completed" },
      { id: 6, area: "Technical Planning Documentation", primaryOwner: "Manya Kedia", secondaryOwner: "Akshat", status: "In Progress" },
      { id: 7, area: "Security Auditing & Protection", primaryOwner: "Sneha Choudhary", secondaryOwner: "Manya Kedia", status: "In Progress" },
      { id: 8, area: "Unit & Automated Integration Testing", primaryOwner: "Rudraksh", secondaryOwner: "Sneha Choudhary", status: "Planned" },
      { id: 9, area: "Project Management & Releases", primaryOwner: "Manya Kedia", secondaryOwner: "Akshat", status: "Completed" }
    ];
    res.json(matrix);
  } catch (err) {
    console.error('Get matrix error:', err);
    res.status(500).json({ error: 'Failed to retrieve responsibility matrix.' });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const team = [
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
        id: "rudraksh",
        name: "Rudraksh",
        role: "Full Stack Engineer",
        primaryResponsibility: "State synchronization components, responsive views layout styling, and backend APIs.",
        currentSprint: "Documentation UI Overhaul",
        technicalSkills: ["React", "Tailwind CSS", "Node.js", "Express", "Database Queries"],
        currentTask: "Refactoring the scrollspy navigation panel and slideshow preview handlers.",
        currentFocus: "Extracting styling utilities into global tokens variables to prevent CSS duplication.",
        initials: "RC",
        color: "#3F7D58"
      },
      {
        id: "akshat",
        name: "Akshat",
        role: "Frontend Developer",
        primaryResponsibility: "User interface design, accessibility, and client-side logic.",
        currentSprint: "UI Component Library",
        technicalSkills: ["React", "Framer Motion", "CSS Variables", "UI/UX", "A11y ARIA"],
        currentTask: "Implementing responsive design breakpoints across the dashboard.",
        currentFocus: "Enhancing the visual consistency of the project portfolio.",
        initials: "AK",
        color: "#B8863B"
      },
      {
        id: "sneha",
        name: "Sneha Choudhary",
        role: "Backend & Security Engineer",
        primaryResponsibility: "Access control middleware APIs, secure storage, and testing frameworks.",
        currentSprint: "Access Credentials Audit",
        technicalSkills: ["REST API", "Database Security", "JSON Web Tokens", "Authentication", "Testing"],
        currentTask: "Implementing JWT validation guards and mock data sandbox endpoints.",
        currentFocus: "Securing document file upload parameters from directory traversal bugs.",
        initials: "SC",
        color: "#7B68EE"
      }
    ];

    res.json(team);
  } catch (err) {
    console.error('Get team members error:', err);
    res.status(500).json({ error: 'Failed to retrieve team members.' });
  }
};
