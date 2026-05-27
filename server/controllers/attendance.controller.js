const pool = require('../db');

// Punch In
const punchIn = async (req, res) => {
  const user_id = req.user.id;

  try {
    const now = new Date();
    const date = now.toLocaleDateString('en-CA');
    const status = now.getHours() < 8 ? 'on_time' : 'late';

    const result = await pool.query(
      `INSERT INTO attendance (user_id, login_time, date, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, now, date, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ message: 'Already punched in today' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Punch Out
const punchOut = async (req, res) => {
  const user_id = req.user.id;

  try {
    const date = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `UPDATE attendance SET logout_time = $1
       WHERE user_id = $2 AND date = $3 RETURNING *`,
      [new Date(), user_id, date]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'No punch-in record found for today' });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get My Record
const getMyRecord = async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const date = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT * FROM attendance WHERE user_id = $1 AND date = $2`,
      [user_id, date]
    );

    res.status(200).json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Records
const getAllRecords = async (req, res) => {
  const { date, user_id } = req.query;

  try {
    let query = `
      SELECT a.*, u.name, u.email
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      params.push(date);
      query += ` AND a.date = $${params.length}`;
    }
    if (user_id) {
      params.push(user_id);
      query += ` AND a.user_id = $${params.length}`;
    }

    query += ` ORDER BY a.date DESC, a.login_time DESC`;

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { punchIn, punchOut, getMyRecord, getAllRecords };