const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let name = error.name || 'ServerError';
  let errorDetails = null;

  if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400; 
    name = 'SlugError';
    message = 'A category with this slug already exists. Please use a different slug.';
    errorDetails = {
      field: error.errors[0]?.path || 'unknown',
      value: error.errors[0]?.value || 'unknown',
    };
  }
  else if (error.name === 'SequelizeValidationError') {
    statusCode = 400; 
    name = 'ValidationError';
    message = 'Validation failed for one or more fields.';
    errorDetails = error.errors.map(err => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));
  }
  else if (error.name === 'CustomError') {
    statusCode = error.statusCode || 400;
    name = error.name;
    message = error.message;
  }

  console.error(`Error: ${name} - ${message}`, {
    statusCode,
    errorDetails,
    stack: error.stack,
  });

  res.status(statusCode).json({
    error: {
      name,
      message,
      statusCode,
      details: errorDetails,
    },
  });
};

module.exports = errorHandler;