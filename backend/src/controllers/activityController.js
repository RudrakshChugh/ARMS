import db from '../config/db.js';

export const getActivities = async (req, res) => {
  try {
    const actRes = await db.query('SELECT * FROM activities ORDER BY id DESC');
    const activities = actRes.rows.map(a => ({
      id: `act-${a.id}`,
      action: a.action,
      person: a.person,
      timestamp: a.timestamp,
      version: a.version
    }));
    res.json(activities);
  } catch (err) {
    console.error('Get activities error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};
