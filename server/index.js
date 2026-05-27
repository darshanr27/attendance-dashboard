require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const pool = require('./db');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/admin', adminRoutes);

app.get('/health', async (req, res) => {
  const result = await pool.query('SELECT COUNT(*) FROM users');
  res.json({ status: 'OK', users: result.rows[0].count });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
