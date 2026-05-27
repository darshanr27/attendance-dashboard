const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');
const pool = require('../db');

router.get('/employees', authMiddleware, roleGuard('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email FROM users WHERE role = 'employee' ORDER BY name`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;