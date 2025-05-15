const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    productId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'categoryId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    subCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'SubCategories',
        key: 'subCategoryId',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subImages: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    availableStatus: {
      type: DataTypes.ENUM('Ready to Ship', 'On Booking'),
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    variations: {
      type: DataTypes.JSON, // Store as [{ type: "Size", values: ["S", "M", "XL"] }, ...]
      allowNull: true,
    },
    variationStock: {
      type: DataTypes.JSON, // Store as { "S-Blue": 10, "S-Green": 15, ... }
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Product;
};