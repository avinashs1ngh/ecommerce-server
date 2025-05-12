const express = require('express');
const {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload'); // Import multer middleware

const router = express.Router();

// Protect all routes with authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Category routes
router.get('/', getAllCategory); // GET /api/category
router.get('/:id', getCategoryById); // GET /api/category/:id
router.post('/', upload.single('image'), createCategory); // POST /api/category
router.put('/:id', upload.single('image'), updateCategory); // PUT /api/category/:id
router.delete('/:id', deleteCategory); // DELETE /api/category/:id

module.exports = router;