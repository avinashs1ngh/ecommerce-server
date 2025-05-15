const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const SubCategory = sequelize.define('SubCategory', {
    subCategoryId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subCategorySlug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'categoryId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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

  return SubCategory;
};