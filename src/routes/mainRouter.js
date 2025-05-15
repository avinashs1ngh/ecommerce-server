const express = require('express');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const categoryRouter = require('./categoryRouter');
const subCategoryRouter = require('./subCategoryRouter');
const productRouter = require('./productRouter');






const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/category', categoryRouter);
router.use('/subcategory', subCategoryRouter);
router.use('/products', productRouter);





module.exports = router;