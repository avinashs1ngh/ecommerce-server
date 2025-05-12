const { User } = require('../models');
const CustomError = require('../utils/errorHandler');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt'], // Exclude password
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'role', 'createdAt'], // Exclude password
    });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, role, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Update user fields
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password; // Password will be hashed by beforeCreate hook

    await user.save();
    res.json({ message: 'User updated successfully', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };