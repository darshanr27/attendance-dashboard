const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
module.exports = router;