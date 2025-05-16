const { sequelize } = require('../config/db');

// Model imports
const UserModel = require('./User');
const OrderModel = require('./Order');
const CategoryModel = require('./Category');
const SubCategoryModel = require('./SubCategory');
const ProductModel = require('./Product');
const AttributeModel = require('./Attribute');
const OptionModel = require('./Option');
const OptionImageModel = require('./OptionImage');
const VariantModel = require('./Variant');
const VariantImageModel = require('./VariantImage');
const VariantOptionModel = require('./VariantOption');

// Model instances
const User = UserModel(sequelize);
const Order = OrderModel(sequelize);
const Category = CategoryModel(sequelize);
const SubCategory = SubCategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Attribute = AttributeModel(sequelize);
const Option = OptionModel(sequelize);
const OptionImage = OptionImageModel(sequelize);
const Variant = VariantModel(sequelize);
const VariantImage = VariantImageModel(sequelize);
const VariantOption = VariantOptionModel(sequelize);

// User ↔ Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Category ↔ SubCategory
Category.hasMany(SubCategory, { foreignKey: 'parentCategoryId', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'parentCategoryId', as: 'parentCategory' });

// Category/SubCategory ↔ Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
SubCategory.hasMany(Product, { foreignKey: 'subCategoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: 'subCategory' });

// Attribute ↔ Option
Attribute.hasMany(Option, { foreignKey: 'attributeId', as: 'options' });
Option.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });

// Option ↔ OptionImage
Option.hasMany(OptionImage, { foreignKey: 'optionId', as: 'images' });
OptionImage.belongsTo(Option, { foreignKey: 'optionId', as: 'option' });

// Product ↔ Variant
Product.hasMany(Variant, { foreignKey: 'productId', as: 'variants' });
Variant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Variant ↔ VariantImage
Variant.hasMany(VariantImage, { foreignKey: 'variantId', as: 'images' });
VariantImage.belongsTo(Variant, { foreignKey: 'variantId', as: 'variant' });

// Variant ↔ Option through VariantOption
Variant.belongsToMany(Option, {
  through: VariantOption,
  foreignKey: 'variantId',
  otherKey: 'optionId',
  as: 'options',
});
Option.belongsToMany(Variant, {
  through: VariantOption,
  foreignKey: 'optionId',
  otherKey: 'variantId',
  as: 'variants',
});

module.exports = {
  sequelize,
  User,
  Order,
  Category,
  SubCategory,
  Product,
  Attribute,
  Option,
  OptionImage,
  Variant,
  VariantImage,
  VariantOption,
};
