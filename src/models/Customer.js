const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    customerId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{10}$/, 
      },
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        street: '',
        building: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
    billingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        street: '',
        building: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
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

  return Customer;
};