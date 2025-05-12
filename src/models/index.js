const { sequelize } = require('../config/db');
const UserModel = require('./User');
const OrderModel = require('./Order');
const CategoryModel = require('./Category');

const User = UserModel(sequelize);
const Order = OrderModel(sequelize);
const Category = CategoryModel(sequelize);
// Define associations if needed
// e.g., User.hasMany(Order);

module.exports = {
  sequelize,
  User,
  Order,
  Category
};