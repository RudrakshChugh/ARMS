import db from '../config/db.js';

export const getStages = async (req, res) => {
  try {
    const stageRes = await db.query('SELECT * FROM stages ORDER BY order_number ASC');
    res.json(stageRes.rows);
  } catch (err) {
    console.error('Get stages error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};

export const getStageById = async (req, res) => {
  const { id } = req.params;
  try {
    const stageRes = await db.query('SELECT * FROM stages WHERE id = $1', [id]);
    if (stageRes.rows.length === 0) {
      return res.status(404).json({ error: 'Milestone stage not found.' });
    }
    res.json(stageRes.rows[0]);
  } catch (err) {
    console.error('Get stage by id error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }
};

export const markStageComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const stageCheck = await db.query('SELECT * FROM stages WHERE id = $1', [id]);
    if (stageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Milestone stage not found.' });
    }

    const updateRes = await db.query(
      "UPDATE stages SET status = 'Completed' WHERE id = $1 RETURNING *",
      [id]
    );

    res.json(updateRes.rows[0]);
  } catch (err) {
    console.error('Mark stage complete error:', err);
    res.status(500).json({ error: 'Database update query failed.' });
  }
};
