const express = require('express');
const { login, register, logout, verify, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verify);
router.post('/register', register);
router.post('/logout',authMiddleware, logout);
router.post('/change-password', authMiddleware, changePassword);
module.exports = router;