const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered'),
      defaultValue: 'pending',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Order;
};