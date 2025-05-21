/* eslint consistent-return: 0 */
const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * Global error-handling middleware.
 * Make sure this is the LAST app.use() in app.js.
 */
const errorHandler = (err, req, res, next) => {
  // --- Default values ---
  let statusCode = err.statusCode || 500;
  let name       = err.name       || 'ServerError';
  let message    = err.message    || 'Internal Server Error';
  let details    = err.details    || null;

  // --- Sequelize: duplicate key, unique constraint ---
  if (err instanceof UniqueConstraintError) {
    statusCode = 400;
    name       = 'SlugError';
    message    = 'A record with this unique value already exists.';
    details    = err.errors.map(e => ({
      field:  e.path,
      value:  e.value,
      msg:    e.message,
    }));
  }

  // --- Sequelize: validation failure ---
  else if (err instanceof ValidationError) {
    statusCode = 400;
    name       = 'ValidationError';
    message    = 'Validation failed for one or more fields.';
    details    = err.errors.map(e => ({
      field:   e.path,
      value:   e.value,
      msg:     e.message,
    }));
  }

  // --- Your custom class ---
  else if (err.name === 'CustomError') {
    statusCode = err.statusCode || 400;
    // message & details already set
  }

  // --- JWT / Auth errors you might throw with jsonwebtoken ---
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    name       = err.name;
    message    = 'Invalid or expired token.';
  }

  // Log stack trace only in DEV
  if (process.env.NODE_ENV !== 'test') {
    console.error(`❌ ${name} – ${message}`, {
      statusCode,
      details,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    error: { name, message, statusCode, details },
  });
};

module.exports = errorHandler;
