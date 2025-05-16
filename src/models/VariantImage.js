// models/VariantImage.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const VariantImage = sequelize.define('VariantImage', {
    imageId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Variants',
        key: 'variantId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  return VariantImage;
};