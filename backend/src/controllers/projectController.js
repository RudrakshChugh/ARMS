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
        id: "akshat",
        name: "Akshat",
        role: "Machine Learning Engineer",
        technicalSkills: ["Python", "PyTorch", "Data Preprocessing", "Feature Engineering", "Model Deployment"],
        initials: "AK",
        color: "#B8863B"
      },
      {
        id: "manya",
        name: "Manya Kedia",
        role: "Backend Engineer",
        technicalSkills: ["Node.js", "Express", "PostgreSQL", "REST API Design", "Docker"],
        initials: "MK",
        color: "#49796B"
      },
      {
        id: "rudraksh",
        name: "Rudraksh Chugh",
        role: "Machine Learning Engineer",
        technicalSkills: ["Python", "PyTorch", "scikit-learn", "Pandas & NumPy", "Model Evaluation"],
        initials: "RC",
        color: "#3F7D58"
      },
      {
        id: "sneha",
        name: "Sneha Choudhary",
        role: "Frontend Engineer",
        technicalSkills: ["React", "JavaScript", "Responsive Design", "State Management", "Component Testing"],
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
