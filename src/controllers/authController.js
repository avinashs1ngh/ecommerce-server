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
    if (!req.user) throw new CustomError('Unauthorized', 401);

    res.json({
      message: 'Token verified',
      user: {
        id:    req.user.id,
        email: req.user.email,
        role:  req.user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
const register = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // basic validation
    if (!email || !password)
      throw new CustomError('Email and password are required', 400);

    // duplicate check
    const exists = await User.findOne({ where: { email } });
    if (exists) throw new CustomError('User already exists', 400);

    // create + hash (assuming User model has hook or you hash here)
    const user   = await User.create({ email, password, role: role || 'user' });

    const token  = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword)
      throw new CustomError('Old and new passwords are required', 400);

    const user = await User.findByPk(req.user.id);
    if (!user) throw new CustomError('User not found', 404);

    const ok = await user.comparePassword(oldPassword);
    if (!ok) throw new CustomError('Incorrect old password', 401);

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, logout,verify,changePassword };