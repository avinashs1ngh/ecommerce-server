const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Protect all user routes with authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// User routes
router.get('/', getAllUsers); // GET /api/users
router.get('/:id', getUserById); // GET /api/users/:id
router.put('/:id', updateUser); // PUT /api/users/:id
router.delete('/:id', deleteUser); // DELETE /api/users/:id

module.exports = router;