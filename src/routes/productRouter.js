const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getOptions,
  createOption,
  updateOption,
  deleteOption
} = require('../controllers/productControllers');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Secure all product-related routes
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

/** Attribute Routes */
router.get('/attributes', getAttributes);
router.post('/attributes', createAttribute);
router.put('/attributes/:attributeId', updateAttribute);
router.delete('/attributes/:attributeId', deleteAttribute);

/** Option Routes (nested under attribute) */
router.get('/attributes/:attributeId/options', getOptions);
router.post(
  '/attributes/:attributeId/options',
  upload.array('optionImages', 5),
  createOption
);
router.put(
  '/attributes/:attributeId/options/:optionId',
  upload.array('optionImages', 5),
  updateOption
);
router.delete('/attributes/:attributeId/options/:optionId', deleteOption);

/** Product Routes */
router.get('/', getAllProducts);
router.get('/:id', getProductById); // Move dynamic route after specific routes
router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
    { name: 'variantImages', maxCount: 50 },
    { name: 'optionImages', maxCount: 50 },
  ]),
  createProduct
);
router.put(
  '/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 10 },
    { name: 'variantImages', maxCount: 50 },
    { name: 'optionImages', maxCount: 50 },
  ]),
  updateProduct
);
router.delete('/:id', deleteProduct);

module.exports = router;