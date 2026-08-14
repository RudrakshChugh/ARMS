import db from '../config/db.js';

export const getVersions = async (req, res) => {
  try {
    const verRes = await db.query('SELECT * FROM project_versions ORDER BY id DESC');
    
    // Map db models structure to match frontend expectations
    const versions = verRes.rows.map(v => ({
      version: v.version,
      date: v.date,
      author: v.author,
      changeSummary: v.change_summary,
      commit: v.commit_sha,
      filesChanged: v.files_changed,
      added: v.added,
      modified: v.modified,
      removed: v.removed
    }));

    res.json(versions);
  } catch (err) {
    console.error('Get versions error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};
