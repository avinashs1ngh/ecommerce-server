const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    categoryId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), 
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorySlug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
     typeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Types',
        key: 'typeId',
      },
      onDelete: 'RESTRICT',
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

  return Category;
};