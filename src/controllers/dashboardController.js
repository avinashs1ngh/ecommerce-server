const { Order } = require('../models');
const CustomError = require('../utils/errorHandler');

const getDashboardData = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const recentOrders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json({
      totalOrders,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };