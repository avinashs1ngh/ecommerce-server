const { sequelize } = require('../config/db');
const UserModel = require('./User');
const OrderModel = require('./Order');
const CategoryModel = require('./Category');
const SubCategoryModel = require('./SubCategory');
const ProductModel = require('./Product');

const User = UserModel(sequelize);
const Order = OrderModel(sequelize);
const Category = CategoryModel(sequelize);
const SubCategory = SubCategoryModel(sequelize);
const Product = ProductModel(sequelize);

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(SubCategory, { foreignKey: 'parentCategoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'parentCategoryId', as: 'parentCategory' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
SubCategory.hasMany(Product, { foreignKey: 'subCategoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: 'subCategory' });

module.exports = {
  sequelize,
  User,
  Order,
  Category,
  SubCategory,
  Product
};