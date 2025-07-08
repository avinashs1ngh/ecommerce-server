const express = require('express');
const typeController =require('../controllers/typeController')

const { getAllProductsPublic, getProductsByTypePublic, getProductByIdPublic } = require('../controllers/productControllers');
const { getPublic } = require('../controllers/publicController');
const router = express.Router();


router.get('/',getPublic)
router.get('/products',getAllProductsPublic ); 
router.get('/products/:productId', getProductByIdPublic); 
router.get('/collections', typeController.getAllTypesPublic);
router.get('/collections/:typeSlug', getProductsByTypePublic);
module.exports = router;