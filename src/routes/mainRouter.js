const express = require('express');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const categoryRouter = require('./categoryRouter');

// const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/category', categoryRouter);

// router.use('/dashboard', dashboardRoutes);

module.exports = router;