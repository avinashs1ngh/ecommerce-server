// models/VariantOption.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VariantOption = sequelize.define('VariantOption', {
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
    optionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Options',
        key: 'optionId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    primaryKey: true,
  });

  return VariantOption;
};