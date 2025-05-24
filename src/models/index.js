const { sequelize } = require('../config/db');

const UserModel = require('./User');
const CustomerModel = require('./Customer');
const OrderModel = require('./Order');
const CategoryModel = require('./Category');
const SubCategoryModel = require('./SubCategory');
const ProductModel = require('./Product');
const VariantModel = require('./Variant');
const ProductCategoriesModel = require('./ProductCategories');
const ProductSubCategoriesModel = require('./ProductSubCategories');

const User = UserModel(sequelize);
const Customer = CustomerModel(sequelize);
const Order = OrderModel(sequelize);
const Category = CategoryModel(sequelize);
const SubCategory = SubCategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Variant = VariantModel(sequelize);
const ProductCategories = ProductCategoriesModel(sequelize);
const ProductSubCategories = ProductSubCategoriesModel(sequelize);

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Category.hasMany(SubCategory, { foreignKey: 'parentCategoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'parentCategoryId', as: 'parentCategory' });

Product.belongsToMany(Category, { through: ProductCategories, foreignKey: 'productId', as: 'categories' });
Category.belongsToMany(Product, { through: ProductCategories, foreignKey: 'categoryId', as: 'products' });

Product.belongsToMany(SubCategory, { through: ProductSubCategories, foreignKey: 'productId', as: 'subCategories' });
SubCategory.belongsToMany(Product, { through: ProductSubCategories, foreignKey: 'subCategoryId', as: 'products' });

Product.hasMany(Variant, { foreignKey: 'productId', as: 'variants' });
Variant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Customer,
  Order,
  Category,
  SubCategory,
  Product,
  Variant,
  ProductCategories,
  ProductSubCategories,
};