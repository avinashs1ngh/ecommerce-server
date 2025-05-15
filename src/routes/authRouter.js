const express = require('express');
const { login, register, logout, verify } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verify);
router.post('/register', register);
router.post('/logout', logout);

module.exports = router;