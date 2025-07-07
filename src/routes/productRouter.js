const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsPublic,
  getProductsByTypePublic
} = require('../controllers/productControllers');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const orderController = require('../controllers/orderController');

const router = express.Router();
router.get('/public', getAllProductsPublic);
router.get('/public/collections/:typeSlug', getProductsByTypePublic);
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
    { name: 'variantImages', maxCount: 100 },
  ]),
  createProduct
);
router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
    { name: 'variantImages', maxCount: 100 },
  ]),
  updateProduct
);
router.delete('/:id', deleteProduct);
router.get('/:id/variants', orderController.getProductVariants);
module.exports = router;