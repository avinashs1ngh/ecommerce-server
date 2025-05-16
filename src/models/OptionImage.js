// models/OptionImage.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const OptionImage = sequelize.define('OptionImage', {
    imageId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
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
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });

  return OptionImage;
};