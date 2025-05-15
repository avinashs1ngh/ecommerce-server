const express = require('express');
const {
  getAllSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require('../controllers/subCategoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getAllSubCategories); 
router.get('/:id', getSubCategoryById); 
router.post('/', createSubCategory); 
router.put('/:id', updateSubCategory); 
router.delete('/:id', deleteSubCategory); 

module.exports = router;