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
const upload = require('../middleware/upload');

const router = express.Router();


router.use(authMiddleware);
router.use(roleMiddleware(['admin']));


router.get('/', getAllCategory); 
router.get('/:id', getCategoryById); 
router.post('/', upload.single('image'), createCategory); 
router.put('/:id', upload.single('image'), updateCategory); 
router.delete('/:id', deleteCategory); 

module.exports = router;