const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    orderId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Customers', key: 'customerId' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        notEmpty: true,
        isValidProducts(value) {
          if (!Array.isArray(value)) {
            throw new Error('Products must be an array');
          }
          for (const product of value) {
            if (!product.productId || !product.quantity || product.quantity <= 0) {
              throw new Error('Invalid product details');
            }
            if (product.discount && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100)) {
              throw new Error('Discount must be a number between 0 and 100');
            }
          }
        },
      },
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
status: {
  type: DataTypes.ENUM('Processing', 'Pending Payment', 'On Hold', 'Shipped', 'Ready to Ship', 'Cancelled'),
  defaultValue: 'Pending Payment',
},
   paymentMethod: {
  type: DataTypes.ENUM('online_payment', 'cod', 'direct_bank_transfer'),
  allowNull: false,
},
    shippingMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderNotes: {
      type: DataTypes.TEXT,
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

  return Order;
};