const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    categoryId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Auto-generate UUID
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorySlug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure slugs are unique for SEO
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING, // Store the image path or URL
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

  return Category;
};