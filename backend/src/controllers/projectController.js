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
    const matrixRes = await db.query('SELECT * FROM responsibility_matrix ORDER BY id ASC');
    res.json(matrixRes.rows);
  } catch (err) {
    console.error('Get matrix error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const teamRes = await db.query('SELECT * FROM users WHERE role = $1 OR role = $2 ORDER BY id ASC', ['admin', 'instructor']);
    
    // We map users list to team profiles with design system colors
    const team = teamRes.rows.map((u, i) => {
      const colors = ['#49796B', '#3F7D58', '#B8863B'];
      const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      // Merge with custom details if necessary or use standards
      return {
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        role: u.role === 'admin' ? 'Lead Systems Architect & PM' : 'Backend & Security Engineer',
        primaryResponsibility: u.role === 'admin' 
          ? 'Relational database schema modeling, deployment configuration, and pipeline releases.'
          : 'Access control middleware APIs, secure storage, and testing frameworks.',
        currentSprint: u.role === 'admin' ? 'Staging Pipeline Refinement' : 'Access Credentials Audit',
        technicalSkills: u.role === 'admin' 
          ? ["PostgreSQL", "Docker", "Git Actions", "System Design", "Vite Compiler"]
          : ["Go REST API", "Redis Cache", "JSON Web Tokens", "Docker Sandbox", "JUnit testing"],
        currentTask: u.role === 'admin'
          ? "Configuring the automated publication pipeline validators inside the Release Control Center."
          : "Implementing JWT validation guards and mock data sandbox endpoints.",
        currentFocus: u.role === 'admin'
          ? "Verifying multi-asset document browser integrations and state update routes."
          : "Securing document file upload parameters from directory traversal bugs.",
        initials,
        color: colors[i % colors.length]
      };
    });

    res.json(team);
  } catch (err) {
    console.error('Get team members error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};
