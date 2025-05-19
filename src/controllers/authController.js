const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const CustomError = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("the coming req. is", email, "and", password);

  try {
    const user = await User.findOne({ where: { email } });
    console.log("the user matched is", JSON.stringify(user));

    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log("the compare password is", isPasswordValid);

    if (!isPasswordValid) {
      throw new CustomError('Invalid credentials', 401);
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};
const verify = async (req, res, next) => {
  try {
 
    res.json({
      message: 'Token verified',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
const register = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      role: role || 'user',
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // In a JWT-based system, logout is typically handled client-side by removing the token
    // Here, we just send a success response
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; 

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new CustomError('Incorrect old password', 401);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, logout,verify,changePassword };