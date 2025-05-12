const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'admin',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};