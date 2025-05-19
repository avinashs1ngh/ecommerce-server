const { sequelize } = require('../config/db');

const UserModel = require('./User');
const OrderModel = require('./Order');
const CategoryModel = require('./Category');
const SubCategoryModel = require('./SubCategory');
const ProductModel = require('./Product');
const VariantModel = require('./Variant');

const User = UserModel(sequelize);
const Order = OrderModel(sequelize);
const Category = CategoryModel(sequelize);
const SubCategory = SubCategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Variant = VariantModel(sequelize);

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(SubCategory, { foreignKey: 'parentCategoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'parentCategoryId', as: 'parentCategory' });

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
SubCategory.hasMany(Product, { foreignKey: 'subCategoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: 'subCategory' });

Product.hasMany(Variant, { foreignKey: 'productId', as: 'variants' });
Variant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Order,
  Category,
  SubCategory,
  Product,
  Variant,
};