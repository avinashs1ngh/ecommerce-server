const jwt = require('jsonwebtoken');
const { User } = require('../models');
const CustomError = require('../utils/errorHandler');
const config = require('../config/config');

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError('Unauthorized: No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user by ID from the token payload
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role'], // Exclude password
    });

    if (!user) {
      throw new CustomError('Unauthorized: User not found', 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new CustomError('Unauthorized: Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new CustomError('Unauthorized: Token expired', 401);
    }
    next(error); // Pass other errors to errorMiddleware
  }
};

module.exports = authMiddleware;