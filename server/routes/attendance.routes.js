const express = require('express');
const router = express.Router();
const {
  punchIn,
  punchOut,
  getMyRecord,
  getAllRecords
} = require('../controllers/attendance.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');


router.post('/punch-in', authMiddleware, punchIn);
router.patch('/punch-out', authMiddleware, punchOut);
router.get('/me', authMiddleware, getMyRecord);
router.get('/all', authMiddleware, roleGuard('admin'), getAllRecords);

module.exports = router;