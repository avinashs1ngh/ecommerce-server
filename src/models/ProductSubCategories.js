const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductSubCategories = sequelize.define('ProductSubCategories', {
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Products', key: 'productId' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    subCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'SubCategories', key: 'subCategoryId' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  }, {
    tableName: 'ProductSubCategories',
    timestamps: false,
  });

  return ProductSubCategories;
};