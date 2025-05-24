const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductCategories = sequelize.define('ProductCategories', {
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Products', key: 'productId' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Categories', key: 'categoryId' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'ProductCategories',
    timestamps: false,
  });

  return ProductCategories;
};