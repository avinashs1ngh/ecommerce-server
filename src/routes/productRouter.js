const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes with authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Product routes
router.get('/', getAllProducts); // GET /api/product
router.get('/:id', getProductById); // GET /api/product/:id
router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
  ]),
  createProduct
); // POST /api/product
router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
  ]),
  updateProduct
); // PUT /api/product/:id
router.delete('/:id', deleteProduct); // DELETE /api/product/:id

module.exports = router;