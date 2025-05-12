const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

module.exports = errorHandler;