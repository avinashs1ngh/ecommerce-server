const CustomError = require('../utils/errorHandler');

const roleMiddleware = (allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role; // req.user is set by authMiddleware

  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new CustomError('Forbidden: Insufficient permissions', 403);
  }

  next();
};

module.exports = roleMiddleware;