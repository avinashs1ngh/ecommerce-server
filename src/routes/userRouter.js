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

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getAllUsers); 
router.get('/:id', getUserById); 
router.put('/:id', updateUser); 
router.delete('/:id', deleteUser); 

module.exports = router;