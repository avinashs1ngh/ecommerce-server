const express = require('express');
const authRouter = require('./authRouter');
const categoryRouter = require('./categoryRouter');
const subCategoryRouter = require('./subCategoryRouter');
const productRouter = require('./productRouter');
const customerRouter = require('./customerRouter');
const orderRouter = require('./orderRouter');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/subcategory', subCategoryRouter);
router.use('/products', productRouter);
router.use('/customers', customerRouter);
router.use('/orders', orderRouter);


module.exports = router;